import type { RepromptOptions } from "@/app/(main)/chat/components/user-message";
import { activeModelsList } from "@/app/api/chat/lib/ai-models-client.lib";
import { ToneList } from "@/app/api/chat/lib/prompting.lib";
import { z } from "zod";

const AiModelEnum = z.enum(activeModelsList);

const RepromptOptionsSchema = z.object({
  reprompting: z.boolean(),
  messageIndex: z.number().int().nonnegative(),
}) satisfies z.ZodType<RepromptOptions>;

const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;

const Base64ImageSchema = z.string().refine(
  (value) => {
    return base64Regex.test(value);
  },
  { message: "Invalid base64 image format" },
);

// Schema for message parts (text or image content)
// const MessagePartSchema = z.union([
//   z.object({
//     type: z.literal("text"),
//     text: z.string(),
//   }),
//   z.object({
//     type: z.literal("image"),
//     image: z.instanceof(Uint8Array),
//   }),
// ]);

// Schema for a single message with role and content
// const MessageSchema = z.object({
//   role: z.string(),
//   content: z.string().optional(),
//   parts: z.array(MessagePartSchema).optional(),
// });

export const chatApiBodySchema = z.object({
  aiModel: AiModelEnum,
  tone: z.enum(ToneList),
  idSpace: z.string().uuid(),
  base64Images: z.array(Base64ImageSchema).optional(),
  repromptOptions: RepromptOptionsSchema.nullable().optional(),
});

export type ValidatedChatApiCustomBody = z.infer<typeof chatApiBodySchema>;

export function validateChatApiBody(body: unknown): ValidatedChatApiCustomBody {
  return chatApiBodySchema.parse(body);
}

export function safeParseChatApiBody(body: unknown) {
  return chatApiBodySchema.safeParse(body);
}
