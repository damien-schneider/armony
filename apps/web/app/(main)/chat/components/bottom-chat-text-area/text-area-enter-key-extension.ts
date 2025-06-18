import { Extension } from "@tiptap/core";

// Custom extension to handle Enter key behavior
export const EnterKeyHandlerExtension = Extension.create({
  name: "enterKeyHandler",

  addStorage() {
    return {
      submitCallback: null,
      shiftPressed: false,
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        // Access the storage from SnippetsExtension
        const isCommandMenuOpen =
          editor.storage.snippetsExtension?.isCommandMenuOpen;

        // If the menu is open, prevent default behavior
        if (isCommandMenuOpen) {
          return true;
        }

        // If menu is not open, check if shift is pressed using our tracked state
        if (!this.storage.shiftPressed) {
          // Not pressing shift, so submit the message
          if (this.storage.submitCallback) {
            this.storage.submitCallback();
            return true; // Prevent default behavior
          }
        }

        return false; // Let TipTap handle it normally (like inserting a new line with Shift+Enter)
      },
    };
  },
});
