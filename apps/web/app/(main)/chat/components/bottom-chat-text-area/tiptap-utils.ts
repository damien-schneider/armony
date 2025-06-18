import type { Editor } from "@tiptap/react";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";

type MenuNavigationAction = "enter" | "down" | "up";

export function handleMenuNavigationKeys(
  event: ReactKeyboardEvent<HTMLDivElement>,
  isMenuOpen: boolean,
  handleMenuNavigation: (action: MenuNavigationAction, editor: Editor) => void,
  closeMenu: () => void,
  editor: Editor,
): boolean {
  if (!isMenuOpen) {
    return false;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    handleMenuNavigation("down", editor);
    return true;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    handleMenuNavigation("up", editor);
    return true;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return true;
  }
  return false;
}

export function handleEnterKeyWithShift(
  event: ReactKeyboardEvent<HTMLDivElement>,
  isMenuOpen: boolean,
  shiftPressed: boolean,
  handleSubmit: () => void,
): boolean {
  if (event.key === "Enter" && !isMenuOpen && !shiftPressed) {
    event.preventDefault();
    handleSubmit();
    return true;
  }
  return false;
}

export function handleEnterKeyWithMenuOpen(
  event: ReactKeyboardEvent<HTMLDivElement>,
  isMenuOpen: boolean,
  handleMenuNavigation: (action: MenuNavigationAction, editor: Editor) => void,
  editor: Editor,
): boolean {
  if (event.key === "Enter" && isMenuOpen) {
    event.preventDefault();
    handleMenuNavigation("enter", editor);
    return true;
  }
  return false;
}
/**
 * Processes pasted text content for the TipTap editor
 * Normalizes line breaks and converts them to HTML breaks
 */
export const processClipboardPastedText = (
  editor: Editor | null,
  clipboardData: DataTransfer | null,
): boolean => {
  const plainText = clipboardData?.getData("text/plain") ?? "";
  // event.preventDefault();

  if (plainText && editor) {
    const normalizedText = plainText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    const textWithBreaks = normalizedText.replace(/\n/g, "<br />");

    editor.commands.insertContent(textWithBreaks);
  }

  return true;
};
