"use client";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import "./text-area-content-editable.css";

import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect } from "react";
import {
  type CommandMenuState,
  SnippetsExtension,
} from "@/app/(main)/chat/components/bottom-chat-text-area/text-area-command-extension";
import { EnterKeyHandlerExtension } from "@/app/(main)/chat/components/bottom-chat-text-area/text-area-enter-key-extension";
import {
  handleEnterKeyWithMenuOpen,
  handleEnterKeyWithShift,
  handleMenuNavigationKeys,
  processClipboardPastedText,
} from "@/app/(main)/chat/components/bottom-chat-text-area/tiptap-utils";
import { useSharedAiChat } from "@/app/(main)/contexts/ai-sdk-chat-context";
import { useSnippetsContext } from "@/app/(main)/contexts/snippets-context";

export const useChatTiptapEditor = () => {
  const { inputValue, setInputValue } = useChatContext();
  const { handleMessageSubmit } = useSharedAiChat();
  const {
    openMenu,
    closeMenu,
    updateSearch,
    isOpen,
    // search,
    // prefix,
    handleMenuNavigation,
  } = useSnippetsContext();

  // Handle command menu state changes
  const handleCommandMenuChange = (newState: CommandMenuState) => {
    if (newState.isOpen) {
      openMenu(newState.prefix);
      updateSearch(newState.query);
    } else {
      closeMenu();
    }
  };

  const editor = useEditor({
    extensions: [
      // StarterKit.configure(),
      Document,
      Paragraph,
      Text,
      HardBreak,
      Placeholder.configure({
        placeholder: "Type a message...",
        showOnlyWhenEditable: true,
        emptyEditorClass: "is-editor-empty",
      }),
      SnippetsExtension.configure({
        onCommandMenuChange: handleCommandMenuChange,
      }),
      EnterKeyHandlerExtension,
    ],
    immediatelyRender: false,
    content: inputValue,
    editorProps: {
      attributes: {
        class:
          "break-words font-medium caret-primary max-w-prose min-h-6 outline-none p-3 whitespace-pre-wrap",
        role: "textbox",
        tabIndex: "0",
        translate: "no",
        "aria-label": "Write your message",
        enterKeyHint: "enter",
      },
      handlePaste: (_view, event): boolean => {
        event.preventDefault();
        return processClipboardPastedText(editor, event.clipboardData);
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setInputValue(text);
    },
    autofocus: true,
  });

  // Keep editor content in sync with inputValue (especially when cleared)
  useEffect(() => {
    if (!editor) {
      return;
    }
    if (inputValue === "" && editor.getText() !== "") {
      editor.commands.clearContent();
    }
  }, [inputValue, editor]);

  // Handle message submission
  const handleSubmit = (editor: Editor) => {
    handleMessageSubmit();
    editor.commands.clearContent();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!editor) {
      return;
    }

    if (
      handleEnterKeyWithMenuOpen(event, isOpen, handleMenuNavigation, editor) ||
      handleEnterKeyWithShift(event, isOpen, event.shiftKey, () =>
        handleSubmit(editor),
      ) ||
      handleMenuNavigationKeys(
        event,
        isOpen,
        handleMenuNavigation,
        closeMenu,
        editor,
      )
    ) {
      return;
    }
  };

  const appendTextToEditor = (text: string, editor: Editor) => {
    if (!text) {
      return;
    }
    editor.commands.insertContent(text);
    // setInputValue(editor.getText());
  };

  return {
    editor,
    handleKeyDown,
    appendTextToEditor,
  };
};
