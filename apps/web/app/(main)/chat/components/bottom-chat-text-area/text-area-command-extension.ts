import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";

export type CommandNavigationAction = "up" | "down" | "enter";

export interface CommandMenuState {
  isOpen: boolean;
  query: string;
  prefix: string;
}

export interface SnippetsExtensionOptions {
  onCommandMenuChange: (state: CommandMenuState) => void;
}

/**
 * Creates a command handler for a specific trigger character
 * that manages menu state and keyboard navigation
 */
const createCommandHandler = (
  char: string,
  options: SnippetsExtensionOptions,
) => {
  return {
    onStart: ({ query }: { query: string }) => {
      options.onCommandMenuChange({
        isOpen: true,
        query: `${char}${query}`,
        prefix: char,
      });
    },

    onUpdate: ({ query }: { query: string }) => {
      // Update command query in React component
      options.onCommandMenuChange({
        isOpen: true,
        query: `${char}${query}`,
        prefix: char,
      });
    },

    // This has been removed as the values should be dynamic, which is not the case using an extension
    // onKeyDown: (props: { event: KeyboardEvent }) => {
    //   // Handle navigation keys for menu interaction
    //   switch (props.event.key) {
    //     case "ArrowUp": {
    //       options.onMenuNavigation("up");
    //       return true;
    //     }
    //     case "ArrowDown": {
    //       options.onMenuNavigation("down");
    //       return true;
    //     }
    //     case "Enter": {
    //       // Special handling for Enter key inside command menu
    //       if (!props.event.shiftKey) {
    //         options.onMenuNavigation("enter");
    //         return true;
    //       }
    //       return false;
    //     }
    //     case "Escape": {
    //       // Close the menu
    //       options.onCommandMenuChange({
    //         isOpen: false,
    //         query: "",
    //         prefix: char,
    //       });
    //       return true;
    //     }
    //     default:
    //       return false;
    //   }
    // },

    onExit: () => {
      // Clean up when exiting command mode
      options.onCommandMenuChange({
        isOpen: false,
        query: "",
        prefix: char,
      });
    },
  };
};

/**
 * Extension for handling command menus (/ and @) in the text editor
 */
export const SnippetsExtension = Extension.create<SnippetsExtensionOptions>({
  name: "snippetsExtension",

  addOptions() {
    return {
      onCommandMenuChange: () => {
        // This is a default empty implementation that will be replaced with actual functionality
      },
    };
  },

  // Track if any command menu is currently open
  addStorage() {
    return {
      isCommandMenuOpen: false,
    };
  },

  addProseMirrorPlugins() {
    const updateCommandMenuState = (isOpen: boolean) => {
      this.storage.isCommandMenuOpen = isOpen;
    };

    // Create wrapper for onCommandMenuChange that also updates storage
    const handleCommandMenuChange = (state: CommandMenuState) => {
      updateCommandMenuState(state.isOpen);
      this.options.onCommandMenuChange(state);
    };

    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        items: () => [], // Empty list as we handle suggestions in snippets-menu
        render: () =>
          createCommandHandler("/", {
            ...this.options,
            onCommandMenuChange: handleCommandMenuChange,
          }),
        pluginKey: new PluginKey("slashCommand"),
      }),

      Suggestion({
        editor: this.editor,
        char: "@",
        items: () => [],
        render: () =>
          createCommandHandler("@", {
            ...this.options,
            onCommandMenuChange: handleCommandMenuChange,
          }),
        pluginKey: new PluginKey("mentionCommand"),
      }),
    ];
  },
});
