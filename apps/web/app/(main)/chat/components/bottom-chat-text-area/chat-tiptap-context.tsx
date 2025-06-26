"use client";
import type { Editor } from "@tiptap/react";
import type { KeyboardEvent, ReactNode } from "react";
import { createContext, use } from "react";
import { useChatTiptapEditor } from "@/app/(main)/chat/components/bottom-chat-text-area/use-chat-tiptap-editor";

interface ChatTiptapContextType {
  editor: Editor | null;
  appendTextToEditor: (text: string) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

const ChatTiptapContext = createContext<ChatTiptapContextType | null>(null);

export function ChatTiptapProvider({ children }: { children: ReactNode }) {
  const { editor, handleKeyDown, appendTextToEditor } = useChatTiptapEditor();

  const appendTextToEditorSingleArg = (text: string) => {
    if (editor) {
      appendTextToEditor(text, editor);
    }
  };

  return (
    <ChatTiptapContext.Provider
      value={{
        editor,
        appendTextToEditor: appendTextToEditorSingleArg,
        handleKeyDown,
      }}
    >
      {children}
    </ChatTiptapContext.Provider>
  );
}

export function useChatTiptapContext() {
  const context = use(ChatTiptapContext);
  if (!context) {
    throw new Error(
      "ChatTiptapContext must be used within a ChatTiptapProvider",
    );
  }
  return context;
}
