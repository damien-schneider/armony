import { createServerClient } from "@workspace/supabase/server";
import Chat from "@/app/(main)/chat/chat";

export default async function page({
  params,
}: {
  params: Promise<{ id_chat: string }>;
}) {
  const { id_chat } = await params;
  const supabase = await createServerClient();
  const { data: chat, error } = await supabase
    .from("chats")
    .select("id, messages, model, model_tone")
    .eq("id", id_chat)
    .maybeSingle();

  // If this is a direct navigation to a chat ID that doesn't exist,
  // redirect to the main chat page with an error in the URL
  if (!chat || error) {
    throw new Error("Chat not found");
  }

  return <Chat initialChat={chat} />;
}
