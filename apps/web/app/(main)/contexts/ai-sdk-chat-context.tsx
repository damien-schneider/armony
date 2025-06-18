"use client";
import type {
  MessageWithImages,
  RepromptOptions,
} from "@/app/(main)/chat/components/user-message";
import { fileToBase64 } from "@/app/(main)/chat/utils/file-conversion.utils";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import type { AiModelKey } from "@/app/api/chat/ai-models.type";
import type { ValidatedChatApiCustomBody } from "@/app/api/chat/chat-body-validator";
import type { ChatApiCallCustomBody } from "@/app/api/chat/route";
import { useMessageQuotas } from "@/hooks/queries/client/use-ai-calls.query";
import { useSession } from "@/hooks/queries/use-session";
import { keyChat, keyMessageUsage } from "@/lib/query-key-factory";
import { type UseChatHelpers, useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@workspace/supabase/types/database";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type AiSdkChatContextType = {
  messages: MessageWithImages[];
  status: UseChatHelpers["status"];
  error: Error | undefined;
  handleMessageSubmit: (params?: {
    content?: string;
    repromptOptions?: RepromptOptions | null;
    aiModelSlug?: AiModelKey;
  }) => Promise<void>;

  chatId: string;
};

const AiSdkChatContext = createContext<AiSdkChatContextType | null>(null);

interface AiSdkChatContextProviderProps {
  children: ReactNode;
  initialChat: Pick<
    Tables<"chats">,
    "id" | "messages" | "model" | "model_tone"
  > | null;
  chatId: string;
}

const AiSdkChatContextProvider = ({
  children,
  initialChat,
  chatId,
}: AiSdkChatContextProviderProps) => {
  const { activeSpace } = useSpaceContext();
  const {
    inputValue,
    setInputValue,
    selectedFiles,
    clearFiles,
    model,
    tone,
    changeChatModel,
  } = useChatContext();
  const queryClient = useQueryClient();
  const { idUser } = useSession();

  const selectedFilesLatestState = useRef({
    selectedFiles,
  });

  useEffect(() => {
    selectedFilesLatestState.current = {
      selectedFiles,
    };
  }, [selectedFiles]);

  const initialMessages =
    ((initialChat?.messages ?? null) as unknown as MessageWithImages[]) ?? [];

  const defaultAiCallBody: ChatApiCallCustomBody = {
    idSpace: activeSpace?.id || "",
    tone: tone,
    aiModel: model.slug,
  };

  const { messages, append, status, error, setMessages } = useChat({
    id: chatId,
    initialMessages: initialMessages ?? [],
    body: defaultAiCallBody,
    onToolCall({ toolCall }) {
      console.log("Tool call:", toolCall);
      if (toolCall.toolName === "web_search_preview") {
        // Handle web search preview tool call
        return toolCall;
      }
    },
    api: "/api/chat",
    onResponse(_response) {
      if (messages.length === 0) {
        const newUrl = `/chat/${chatId}`;
        window.history.replaceState({}, "", newUrl);
      }
    },
    onFinish: () => {
      // Invalidate chat list query
      if (activeSpace?.id) {
        queryClient.invalidateQueries({
          queryKey: keyChat.list({ idSpace: activeSpace.id }),
        });
      }

      // Invalidate message quotas to update the sidebar
      if (idUser) {
        queryClient.invalidateQueries({
          queryKey: keyMessageUsage.detail({ userId: idUser }),
        });
      }
    },
  });

  const pathName = usePathname();

  const resetAll = () => {
    // Need to be in a try-catch block to avoid errors when the chat is already stopped
    try {
      stop();
    } catch (error) {
      console.error("Error stopping the chat:", error);
      //Do nothing
    }
    setMessages([]);
    setInputValue("");
    clearFiles();
  };

  useEffect(() => {
    if (pathName === "/chat" && messages.length > 0) {
      resetAll();
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <React Compiler>
  }, [resetAll, pathName, messages]);

  // Map AI SDK status to our status type
  // const status: AiChatStatus = useMemo(() => {
  //   switch (aiSdkStatus) {
  //     case "submitted":
  //     case "streaming":
  //       return "loading";
  //     case "error":
  //       return "error";
  //     case "ready":
  //       return "success";
  //     default:
  //       return "idle";
  //   }
  // }, [aiSdkStatus]);

  // Process images from selected files
  const processSelectedImages = async (files: File[]) => {
    if (files.length === 0) {
      return { imagePreviews: [], base64Images: [] };
    }

    const imagePreviews = files.map((file) => ({
      id: uuidv4(),
      url: URL.createObjectURL(file),
    }));

    const promises = files.map((file) => fileToBase64(file));
    const base64Images = await Promise.all(promises);

    return { imagePreviews, base64Images };
  };

  // Update URL for first message
  const updateUrlForFirstMessage = () => {
    const newUrl = `/chat/${chatId}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Handle reprompting by slicing messages
  const trimMessagesBasedOnIndex = (options: RepromptOptions | null) => {
    if (options) {
      setMessages(messages.slice(0, options.messageIndex));
    }
  };

  const { data: quotas } = useMessageQuotas(idUser);
  // Handle message submission with file attachments

  const handleMessageSubmit = async ({
    content = inputValue,
    repromptOptions = null,
    aiModelSlug,
  }: {
    content?: string;
    repromptOptions?: RepromptOptions | null;
    aiModelSlug?: AiModelKey;
  } = {}) => {
    if (quotas?.isMessageQuotaExceeded) {
      console.error("Message quota exceeded");
      toast.error(
        "You have reached the limit of messages for this plan, please subscribe to continue",
      );
      return;
    }
    const { selectedFiles } = selectedFilesLatestState.current;
    if (aiModelSlug) {
      changeChatModel(aiModelSlug);
    }
    // Early return if no content or files
    if (!content.trim() && selectedFiles.length === 0) {
      toast.error("Please enter a message or select an image");
      return;
    }

    updateUrlForFirstMessage();

    // Process images if any
    const { imagePreviews, base64Images } =
      await processSelectedImages(selectedFiles);

    // Handle reprompt if needed
    trimMessagesBasedOnIndex(repromptOptions);

    // Send message
    setInputValue("");
    clearFiles();
    // Empty images once the message is sent
    const appendBody: ValidatedChatApiCustomBody = {
      ...defaultAiCallBody,
      base64Images: base64Images.length > 0 ? base64Images : undefined,
      repromptOptions: repromptOptions,
      aiModel: aiModelSlug ?? model.slug,
      tone: tone,
    };
    const trimmedContent = content.trim();
    await append(
      {
        role: "user",
        content: trimmedContent,
        id: uuidv4(),
        images: imagePreviews.length > 0 ? imagePreviews : undefined,
      } as MessageWithImages,
      {
        body: appendBody,
      },
    );
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      messages,
      status,
      error,
      handleMessageSubmit,

      chatId,
    }),
    [
      messages,
      error,
      status,
      // biome-ignore lint/correctness/useExhaustiveDependencies: <React Compiler>
      handleMessageSubmit,

      chatId,
    ],
  );

  return (
    <AiSdkChatContext.Provider value={contextValue}>
      {children}
    </AiSdkChatContext.Provider>
  );
};

export { AiSdkChatContextProvider };

export const useSharedAiChat = () => {
  const context = use(AiSdkChatContext);
  if (!context) {
    throw new Error(
      "AI SDK Chat features must be used within an AiSdkChatContextProvider",
    );
  }
  return context;
};
