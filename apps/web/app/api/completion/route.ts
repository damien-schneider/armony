import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const completionRequestBodySchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const { prompt } = completionRequestBodySchema.parse(requestBody);

    const systemPrompt = [
      "You are a pure autocompletion engine.", // identity
      "Rules:", // explicit rules block
      "- Do NOT echo or repeat any part of the user's input.",
      "- Do NOT ever answer questions, explain, or provide any new content beyond the continuation.",
      "- You must predict user's question or description, not AI answers.",
      "- Only output the next token(s): letters, words, punctuation, or whitespace.",
      "- Always include any leading space if the next token is a new word.",
      "- If the completion would turn into an answer or explanation, instead continue the user's text verbatim.",
      "- DO NOT autocomplete by answering the question or providing an explanation. Instead continue the user's text verbatim.",
      "- If the user's input is a question, continue by asking a new one.",
      "",
      "Examples:",
      "example 1: continuing a statement",
      'Input:  "The quick brown fox jumps"\nOutput: " over the lazy dog"',
      "",
      "example 2: user's input is a question — we must continue with *another* question",
      'Input:  "Can you recommend a good fantasy novel?"\nOutput: " What about one with dragons and political intrigue?"',
      "example 3: Do not ask questions that sounds AI answers",
      'Input: "Can "\nOutput should not be: " you tell me more about what you\'re looking for?"',
    ].join("\n");

    const responseStream = streamText({
      model: openai("gpt-4.1-nano"),
      system: systemPrompt,
      // temperature: 0, // deterministic next‐token selection
      // topP: 1.0, // use full probability mass
      stopSequences: ["\n", "."],
      maxTokens: 10, // short continuations
      prompt, // user's partial text
      onFinish: (text) => {
        console.log("Finished text:", text);
      },
    });

    return responseStream.toDataStreamResponse();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.error("Completion API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
