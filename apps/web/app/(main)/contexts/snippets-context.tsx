"use client";
import { useAllUserSnippets } from "@/hooks/queries/client/use-snippets.query";
import { useSession } from "@/hooks/queries/use-session";
import type { Editor } from "@tiptap/react";
import type { Tables } from "@workspace/supabase/types/database";
import { type ReactNode, createContext, use, useEffect, useState } from "react";
import { toast } from "sonner";

type SnippetsQueryResult = Pick<
  Tables<"snippets">,
  "id" | "title" | "content" | "created_at"
>;

interface SnippetsContextType {
  // State
  isOpen: boolean;
  search: string;
  prefix: string;
  filteredSnippets: SnippetsQueryResult[];
  commandValue: string;

  // Setters
  setCommandValue: (value: string) => void;

  // Methods
  openMenu: (prefix: string) => void;
  closeMenu: () => void;
  updateSearch: (query: string) => void;
  handleMenuNavigation: (
    action: "up" | "down" | "enter",
    editor: Editor | null,
  ) => void;
  insertSnippetContent: (
    editor: Editor,
    snippetContent: string,
    prefix: string,
  ) => void;
}

const SnippetsContext = createContext<SnippetsContextType | null>(null);

export function SnippetsProvider({ children }: { children: ReactNode }) {
  const { idUser } = useSession();
  const [isSnippetsMenuOpen, setIsSnippetsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [prefix, setPrefix] = useState("");
  const [commandValue, setCommandValue] = useState("");
  const { data: allSnippets } = useAllUserSnippets(idUser);
  const [filteredSnippets, setFilteredSnippets] = useState<
    SnippetsQueryResult[]
  >([]);

  // Filter snippets based on search term and prefix
  useEffect(() => {
    if (allSnippets) {
      const filtered = getFilteredSnippets({
        snippetList: allSnippets,
        search,
      });
      setFilteredSnippets(filtered);
    }
  }, [allSnippets, search]);

  // Update the selected snippet when the filtered list changes
  useEffect(() => {
    if (filteredSnippets.length > 0 && filteredSnippets[0]?.id) {
      // Set the first snippet as the default selected one
      setCommandValue(filteredSnippets[0].id);
    } else {
      // Reset selection if no snippets match
      setCommandValue("");
    }
  }, [filteredSnippets]);

  const openMenu = (newPrefix: string) => {
    setIsSnippetsMenuOpen(true);
    setPrefix(newPrefix);
  };

  const closeMenu = () => {
    setIsSnippetsMenuOpen(false);
    setSearch("");
    setPrefix("");
  };

  const updateSearch = (query: string) => {
    setSearch(query);
  };

  const getSnippetFromId = (id: string) => {
    if (!allSnippets) {
      return null;
    }
    const snippet = allSnippets.find((s) => s.id === id);
    if (!snippet) {
      toast.error("Snippet not found");
      return null;
    }
    return snippet;
  };

  const getIndexSnippet = (id: string) => {
    const index = filteredSnippets.findIndex((s) => s.id === id);
    if (index === -1) {
      toast.error("Snippet not found");
      return null;
    }
    return index;
  };

  const selectNextSnippet = () => {
    const actualIndex = getIndexSnippet(commandValue);
    if (actualIndex === null || !filteredSnippets) {
      return;
    }
    const nextIndex = (actualIndex + 1) % filteredSnippets.length;
    if (filteredSnippets[nextIndex]?.id) {
      setCommandValue(filteredSnippets[nextIndex].id);
    }
  };

  const selectPreviousSnippet = () => {
    const actualIndex = getIndexSnippet(commandValue);
    if (actualIndex === null || !filteredSnippets) {
      return;
    }
    const previousIndex =
      actualIndex === 0 ? filteredSnippets.length - 1 : actualIndex - 1;
    if (filteredSnippets[previousIndex]?.id) {
      setCommandValue(filteredSnippets[previousIndex].id);
    }
  };

  const handleMenuNavigation = (
    action: "up" | "down" | "enter",
    editor: Editor | null,
  ) => {
    if (!editor) {
      return;
    }
    if (filteredSnippets.length === 0) {
      toast.error("No snippets found");
      return;
    }

    switch (action) {
      case "down": {
        selectNextSnippet();
        break;
      }
      case "up": {
        selectPreviousSnippet();
        break;
      }
      case "enter": {
        const snippet = getSnippetFromId(commandValue);
        if (snippet) {
          insertSnippetContent(editor, snippet.content, prefix);
          closeMenu();
        }
        break;
      }
      default:
        break;
    }
  };

  /**
   * Inserts snippet content into the editor, replacing the trigger prefix
   */

  return (
    <SnippetsContext
      value={{
        // State
        isOpen: isSnippetsMenuOpen,
        search,
        prefix,
        filteredSnippets,
        commandValue,
        // Setters
        setCommandValue,

        // Methods
        openMenu,
        closeMenu,
        updateSearch,
        handleMenuNavigation,
        insertSnippetContent,
      }}
    >
      {children}
    </SnippetsContext>
  );
}

export const useSnippetsContext = () => {
  const context = use(SnippetsContext);
  if (!context) {
    throw new Error(
      "useSnippetsContext must be used within a SnippetsProvider",
    );
  }
  return context;
};

const insertSnippetContent = (
  editor: Editor,
  snippetContent: string,
  prefixToReplace: string,
) => {
  const currentNodePos = editor.state.selection.$head.pos;
  const currentNodeStartPos = editor.state.selection.$head.before();
  const nodeText = editor.state.doc.textBetween(
    currentNodeStartPos,
    currentNodePos,
  );

  const triggerPos = nodeText.lastIndexOf(prefixToReplace);

  if (triggerPos === -1) {
    // Fallback: just insert the content at current position
    editor.commands.insertContent(snippetContent);
    return;
  }

  // Calculate positions for deleting the trigger text
  const startPos = currentNodeStartPos + triggerPos;
  const endPos = currentNodePos;

  // Delete the trigger text
  editor
    .chain()
    .focus()
    .deleteRange({
      from: startPos,
      to: endPos,
    })
    .run();

  // Check if there is text before the trigger and add a space if needed
  const textBeforeTrigger = nodeText.substring(0, triggerPos);
  const hasTextBefore = textBeforeTrigger.trim().length > 0;

  // Process snippet content to preserve line breaks
  const processedContent = processSnippetContent(snippetContent);

  // Insert the snippet content with proper spacing
  if (hasTextBefore) {
    editor.commands.insertContent(` ${processedContent}`, {
      parseOptions: { preserveWhitespace: "full" },
    });
  } else {
    editor.commands.insertContent(processedContent, {
      parseOptions: { preserveWhitespace: "full" },
    });
  }
};

/**
 * Process snippet content to properly handle line breaks for insertion in the editor
 * Converts newlines to proper HTML format that TipTap can render correctly
 */
const processSnippetContent = (content: string): string => {
  // Check if the content has newlines
  if (!content.includes("\n")) {
    return content; // Return as is if no newlines
  }

  // For content with newlines, we need to properly format it as HTML
  // Replace newlines with <br> tags for proper rendering in TipTap
  return content.replace(/\n/g, "<br />");
};

const getFilteredSnippets = ({
  snippetList,
  search,
}: { snippetList: SnippetsQueryResult[]; search: string }) => {
  // if (prefix !== "/") {
  //   return [];
  // }

  if (!search || search === "/") {
    return snippetList;
  }

  // Remove the prefix and spaces from the search term, then convert to lowercase
  const searchTerm = search.slice(1).replace(/\s+/g, "").toLowerCase();

  // If the processed search term is empty, return all snippets
  if (!searchTerm) {
    return snippetList;
  }

  return snippetList.filter((snippet) => {
    // Remove spaces from title and content, then convert to lowercase for comparison
    const titleWithoutSpaces = snippet.title.replace(/\s+/g, "").toLowerCase();
    const contentWithoutSpaces = snippet.content
      .replace(/\s+/g, "")
      .toLowerCase();

    return (
      titleWithoutSpaces.includes(searchTerm) ||
      contentWithoutSpaces.includes(searchTerm)
    );
  });
};
