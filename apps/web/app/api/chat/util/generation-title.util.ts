import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { envServer } from "@/env/server";
import { getTitleGenerationPrompt } from "../lib/prompting.lib";

export async function generateConversationTitle(
  message: string,
): Promise<string | null> {
  try {
    const openaiProvider = createOpenAI({
      apiKey: envServer.OPENAI_API_KEY,
      compatibility: "strict",
    });

    console.log("Generating conversation title...");

    const { text } = await generateText({
      model: openaiProvider("gpt-4.1-nano"),
      prompt: getTitleGenerationPrompt(message),
      maxTokens: 100, // Limit the length of the response
      temperature: 0.3, // Reduce creativity for more consistent titles
    });

    console.log("Generated conversation title:", text);

    // Clean and validate the title
    const title = text.trim();
    if (title.length > 60) {
      return `${title.substring(0, 57)}...`;
    }
    return title;
  } catch (error) {
    console.error("Error generating conversation title:", error);
    return null;
  }
}
