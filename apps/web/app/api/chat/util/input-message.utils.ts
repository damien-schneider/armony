import type { Message } from "ai";
import { base64ToUint8Array } from "@/app/(main)/chat/utils/file-conversion.utils";
import type { ModelDetails } from "@/app/api/chat/ai-models.type";
import type { MessageWithImageContent } from "@/app/api/chat/route";

export function prepareInputMessageContent(
  currentMessage: Message,
  model: ModelDetails[keyof ModelDetails],
  base64Images: string[],
): string | MessageWithImageContent {
  if (!currentMessage.content) {
    throw new Error("Message content is empty");
  }

  if (!model.options.imageInput || base64Images.length === 0) {
    return currentMessage.content;
  }

  const messageContent: MessageWithImageContent = [
    { type: "text", text: currentMessage.content },
  ];

  for (const base64Image of base64Images) {
    try {
      const imageData = base64ToUint8Array(base64Image);
      messageContent.push({ type: "image", image: imageData });
    } catch (error) {
      console.error("Error converting image:", error);
    }
  }

  return messageContent;
}
