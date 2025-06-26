import { createServerClient } from "@workspace/supabase/server";
import { appendResponseMessages, streamText } from "ai";
import type { AiModelKey } from "@/app/api/chat/ai-models.type";
import { validateChatApiBody } from "@/app/api/chat/chat-body-validator";
import { getSystemPrompt } from "@/app/api/chat/lib/prompting.lib";
import {
  checkUserSubscriptionQuotas,
  saveAiCalls,
} from "@/app/api/chat/util/ai-calls.util";
import { getModel } from "@/app/api/chat/util/ai-models-client.util";
import { getModelConfig } from "@/app/api/chat/util/ai-models-server.utils";
import { generateImageTool } from "@/app/api/chat/util/generation-image.util";
import { generateConversationTitle } from "@/app/api/chat/util/generation-title.util";
import { prepareInputMessageContent } from "@/app/api/chat/util/input-message.utils";
import { getAuthenticatedUserOrThrowError } from "@/app/api/utils/authentication-route.util";
// This variable is used by the vercel sdk by default - do not remove it
// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// Type pour représenter le contenu d'un message avec image
export type MessageWithImageContent = Array<
  { type: "text"; text: string } | { type: "image"; image: Uint8Array }
>;

export type ChatApiCallCustomBody = {
  idSpace: string;
  tone: string;
  aiModel: AiModelKey;
  base64Images?: string[];
  repromptOptions?: {
    messageIndex: number;
    repromptType: "clarification" | "elaboration";
  };
};

// type ChatApiCallBody = {
//   messages: MessageWithImageContent[];
//   id: string;
// } & ChatApiCallCustomBody;

export async function POST(req: Request) {
  try {
    const receivedBody = await req.json();
    console.log("Chat API call received", receivedBody);
    const { id, messages, ...customBody } = receivedBody;
    const bodyParsed = validateChatApiBody(customBody);
    const { aiModel, tone, idSpace, base64Images, repromptOptions } =
      bodyParsed;

    const user = await getAuthenticatedUserOrThrowError();

    const supabase = await createServerClient();

    const {
      data: { content: spaceContent },
    } = await supabase
      .from("spaces")
      .select("content")
      .eq("id", idSpace)
      .single()
      .throwOnError();

    await checkUserSubscriptionQuotas({
      idUser: user.id,
    });

    const model = getModel(aiModel);
    const modelConfig = getModelConfig(aiModel);

    let updatedMessages = messages;

    if (repromptOptions) {
      updatedMessages = messages.slice(0, repromptOptions.messageIndex + 1);
    }

    // Préparation du message utilisateur
    const initialMessages = updatedMessages.slice(0, -1);
    const currentMessage = updatedMessages[updatedMessages.length - 1];

    if (!currentMessage) {
      console.error("No message content provided");
      return new Response("No message content provided", { status: 400 });
    }

    const messageContent = prepareInputMessageContent(
      currentMessage,
      model,
      base64Images ?? [],
    );

    const getTools = () => {
      if (model.specificity === "image-generation") {
        if (!modelConfig.imageModel) {
          throw new Error("Image model not found");
        }
        const imageTool = generateImageTool({
          idUser: user.id,
          imageModel: modelConfig.imageModel,
        });
        return imageTool;
      }
      return modelConfig.tools;
    };

    const tools = getTools();

    // Create system message with space context
    const systemPrompt = getSystemPrompt(tone, spaceContent);
    // Send to language model
    const result = streamText({
      model: modelConfig.model,
      system: systemPrompt,
      tools,
      toolChoice: modelConfig.toolChoice,
      // providerOptions: modelConfig.providerOptions,
      messages: [
        ...initialMessages,
        {
          role: "user",
          content: messageContent,
        },
      ],
      onError: (error) => {
        console.error("Error in AI response:", error);
        throw new Error(`Error in AI response: ${error.error}`);
      },
      async onFinish(data) {
        try {
          console.log("Data:", data);
          console.log(
            "Tools",
            data.toolCalls,
            data.toolCalls.length,
            data.toolResults,
          );
          const { response, usage, steps, toolCalls } = data;

          saveAiCalls({
            idUser: user.id,
            usage,
            initialMessages,
            systemPrompt,
            steps,
            model,
            numberOfToolCalls: toolCalls.length,
          });

          let title: string | null = null;

          if (messages.length === 1) {
            title = await generateConversationTitle(messages[0].content);
          }

          // Combine messages and filter out redundant content when parts exist
          const finalMessages = appendResponseMessages({
            messages: updatedMessages,
            responseMessages: response.messages,
          });

          // Remove content when parts exist (content is legacy)
          const optimizedMessages = finalMessages.map((message) => {
            if (
              message.experimental_attachments &&
              message.experimental_attachments.length > 0
            ) {
              const { content: _content, ...messageWithoutContent } = message;
              return messageWithoutContent;
            }
            return message;
          });

          await supabase
            .from("chats")
            .upsert({
              id,
              id_space: idSpace,
              created_by: user.id,
              updated_at: new Date().toISOString(),
              messages: optimizedMessages,
              model: model.slug,
              model_tone: tone,
              title: title ?? undefined,
            })
            .eq("id", id)
            .throwOnError();

          console.log("Chat updated successfully:", id);
        } catch (error) {
          console.error("Error updating chat:", error);
          throw new Error(`Error updating chat: ${error}`);
        }
      },
    });

    if (!result) {
      console.error("Failed to generate response", result);
      return new Response("Failed to generate response", { status: 500 });
    }

    console.log("Response generated successfully", result);
    // Return the response in streaming
    result.consumeStream(); // Continue the processing even if the client disconnects
    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
// Add cost handling
