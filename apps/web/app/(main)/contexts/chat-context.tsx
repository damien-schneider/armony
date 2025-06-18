"use client";
import type {
  AiModelKey,
  ModelDefinition,
} from "@/app/api/chat/ai-models.type";
import { fallbackAiModel } from "@/app/api/chat/lib/ai-models-client.lib";
import {
  type Tone,
  getToneWithFallback,
} from "@/app/api/chat/lib/prompting.lib";
import { getModel } from "@/app/api/chat/util/ai-models-client.util";
import { localStorageKeys } from "@/lib/local-storage-keys";
import type { Tables } from "@workspace/supabase/types/database";
import { useParams } from "next/navigation";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  use,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";

type ChatContextType = {
  activeChatId: string | null;
  changeChat: (id: Tables<"chats">["id"] | null) => void;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isSnippetsMenuOpen: boolean;
  setIsSnippetsMenuOpen: Dispatch<SetStateAction<boolean>>;
  snippetSearch: string;
  setSnippetSearch: Dispatch<SetStateAction<string>>;
  selectedFiles: File[];
  addFiles: (newFiles: FileList) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  model: ModelDefinition; // AI options
  changeChatModel: (modelKey: AiModelKey | string) => void;
  tone: Tone;
  changeChatTone: (tone: Tone | string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [activeChatId, setActiveChatId] = useState<
    Tables<"chats">["id"] | null
  >(null);
  const { id_chat } = useParams<{ id_chat: string | undefined }>();
  const [inputValue, setInputValue] = useState<string>("");
  const [isSnippetsMenuOpen, setIsSnippetsMenuOpen] = useState(false);
  const [snippetSearch, setSnippetSearch] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (id_chat) {
      setActiveChatId(id_chat);
    } else {
      setActiveChatId(null);
    }
  }, [id_chat]);

  const changeChat = (id: Tables<"chats">["id"] | null) => {
    setActiveChatId(id);
  };

  const addFiles = (newFiles: FileList) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(newFiles)]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const [defaultModelKey, _setDefaultModelKey] = useLocalStorage<AiModelKey>(
    localStorageKeys.defaultModel,
    "meta-llama/llama-4-maverick:free",
  );

  const changeChatModel = (modelKey: AiModelKey | string) => {
    const model = getModel(modelKey);
    if (!model) {
      setModel(fallbackAiModel);
      return;
    }
    setModel(model);
  };

  const changeChatTone = (tone: Tone | string) => {
    const toneOrFallback = getToneWithFallback(tone);
    setTone(toneOrFallback);
  };

  const [model, setModel] = useState<ModelDefinition>(
    getModel(defaultModelKey),
  );
  const [tone, setTone] = useState<Tone>("friendly");

  return (
    <ChatContext
      value={{
        activeChatId,
        changeChat,
        inputValue,
        setInputValue,
        isSnippetsMenuOpen,
        setIsSnippetsMenuOpen,
        snippetSearch,
        setSnippetSearch,
        selectedFiles,
        addFiles,
        removeFile,
        clearFiles,
        model,
        // setModel,
        changeChatModel,
        tone,
        changeChatTone,
      }}
    >
      {children}
    </ChatContext>
  );
};

export { ChatContextProvider };

export const useChatContext = () => {
  const context = use(ChatContext);
  if (!context) {
    throw new Error("Chat features must be used within a ChatProvider");
  }
  return context;
};
