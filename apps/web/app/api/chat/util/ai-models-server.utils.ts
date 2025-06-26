import "server-only";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { ImageModel, LanguageModelV1 } from "ai";
import type { AiModelKey } from "@/app/api/chat/ai-models.type";
import { envServer } from "@/env/server";

const openrouter = createOpenRouter({
  apiKey: envServer.NEXT_PRIVATE_OPENROUTER_API_KEY,
});

export const getModelConfig = (modelKey: AiModelKey) => {
  try {
    switch (modelKey) {
      case "openai/gpt-4.1":
      case "openai/gpt-4.1:online":
      case "anthropic/claude-3.7-sonnet:thinking":
      case "anthropic/claude-sonnet-4":
      case "deepseek/deepseek-chat-v3-0324:free":
      case "google/gemini-2.5-pro-preview":
      case "google/gemini-2.5-flash-preview-05-20":
      case "x-ai/grok-3-mini-beta":
      case "meta-llama/llama-4-maverick:free":
      case "mistralai/mistral-nemo":
      case "openai/o3-mini":
      case "mistralai/magistral-medium-2506:thinking":
      case "deepseek/deepseek-r1-0528:free": {
        const chatModel = openrouter.chat(modelKey) as LanguageModelV1;
        return { model: chatModel };
      }
      case "gpt-4o-mini-web-search": {
        const openaiProvider = createOpenAI({
          apiKey: envServer.OPENAI_API_KEY,
          compatibility: "strict",
        });
        return {
          model: openaiProvider.responses("gpt-4o-mini"),
          tools: {
            web_search_preview: openaiProvider.tools.webSearchPreview(),
          },
          toolChoice: "required" as const,
        };
      }
      case "dall-e-3": {
        const openaiProvider = createOpenAI({
          apiKey: envServer.OPENAI_API_KEY,
        });
        return {
          model: openaiProvider("gpt-4.1"),
          //TODO:TO REPLACE BY THE NEW DALL-E 3 MODEL
          // Assertion needed because of an infer error of the ImageModelV1
          imageModel: openaiProvider.image("dall-e-3", {
            maxImagesPerCall: 1,
          }) as ImageModel,
          toolChoice: "required" as const,
        };
      }
      case "dall-e-2": {
        const openaiProvider = createOpenAI({
          apiKey: envServer.OPENAI_API_KEY,
        });
        return {
          model: openaiProvider("gpt-4.1"),
          imageModel: openaiProvider.image("dall-e-2", {
            maxImagesPerCall: 1,
          }) as ImageModel,
          toolChoice: "required" as const,
        };
      }
      //TODO add dall-e 2 for free version and so on
      default: {
        // This will cause a type error if a case is missing above
        const _exhaustiveCheck: never = modelKey;
        throw new Error(`Unhandled model: ${_exhaustiveCheck}`);
      }
      // default:
      //   return null;
    }
  } catch (error) {
    console.error("Error getting model config:", error);
    throw new Error(`Error getting model config: ${error}`);
  }
};
