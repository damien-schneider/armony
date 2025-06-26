"use client";
import { EditorContent } from "@tiptap/react";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import "./text-area-content-editable.css";
import { useChatTiptapContext } from "@/app/(main)/chat/components/bottom-chat-text-area/chat-tiptap-context";

export const ChatTiptapComponent = () => {
  const { editor, handleKeyDown } = useChatTiptapContext();

  return (
    <ScrollArea
      className={cn(
        "z-20 w-full break-words *:max-h-[20dvh]",
        "text-foreground tracking-tight",
      )}
      aria-label="Chat input area"
    >
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
      <div className="relative">
        <EditorContent
          editor={editor}
          className={cn("whitespace-pre-wrap")}
          onKeyDown={handleKeyDown}
        />
      </div>
    </ScrollArea>
  );
};
