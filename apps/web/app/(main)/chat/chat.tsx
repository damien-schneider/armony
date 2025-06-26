"use client";
import type { Tables } from "@workspace/supabase/types/database";
import { P } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect } from "react";
import { v4 } from "uuid";
import { SendChatBottomBar } from "@/app/(main)/chat/components/bottom-chat-text-area/send-chat-bottom-bar";
import { AiConversation } from "@/app/(main)/chat/components/conversation";
import { EmptyChatModelSelection } from "@/app/(main)/chat/components/model-selection";
import {
  AiSdkChatContextProvider,
  useSharedAiChat,
} from "@/app/(main)/contexts/ai-sdk-chat-context";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import type { Tone } from "@/app/api/chat/lib/prompting.lib";

export default function Chat({
  initialChat,
}: {
  initialChat: Pick<
    Tables<"chats">,
    "id" | "messages" | "model" | "model_tone"
  > | null;
}) {
  const newIdChat = v4();

  const { activeSpace } = useSpaceContext();
  if (!activeSpace?.id) {
    return (
      <div className="flex h-full items-center justify-center">
        <P className="text-muted-foreground">
          Please select a space to start a conversation.
        </P>
      </div>
    );
  }

  return (
    <AiSdkChatContextProvider
      chatId={initialChat?.id ?? newIdChat}
      initialChat={initialChat}
    >
      <ChatComponent initialChat={initialChat} />
    </AiSdkChatContextProvider>
  );
}

function ChatComponent({
  initialChat,
}: {
  initialChat: Pick<
    Tables<"chats">,
    "id" | "messages" | "model" | "model_tone"
  > | null;
}) {
  const { changeChatModel, changeChatTone } = useChatContext();

  const { messages, error } = useSharedAiChat();

  useEffect(() => {
    if (initialChat?.model_tone) {
      changeChatTone(initialChat.model_tone as Tone);
    }
  }, [initialChat, changeChatTone]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Adding changeChatModel rerender the component, reseting chatModel everytime we call changeChatModel>
  useEffect(() => {
    if (initialChat?.model) {
      changeChatModel(initialChat.model);
    }
  }, [initialChat]);

  if (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-center pb-2">
      <AiConversation />
      <div className={cn("relative mx-auto w-full max-w-2xl px-2")}>
        <SendChatBottomBar />
      </div>
      {messages.length === 0 && <EmptyChatModelSelection />}
    </div>
  );
}
