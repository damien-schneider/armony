"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";
import { P } from "@workspace/ui/components/typography";
import { ArrowDown3, ArrowUp3 } from "iconsax-react";
import { useEffect, useRef } from "react";
import { useChatTiptapContext } from "@/app/(main)/chat/components/bottom-chat-text-area/chat-tiptap-context";
import { SnippetsMenuCommandItem } from "@/app/(main)/chat/components/snippets/snippets-menu-command-item";
import { useSnippetsContext } from "@/app/(main)/contexts/snippets-context";

export function SnippetsMenu() {
  const { editor } = useChatTiptapContext();
  const {
    isOpen,
    closeMenu,
    prefix,
    filteredSnippets,
    handleMenuNavigation,

    commandValue,
    setCommandValue,
  } = useSnippetsContext();

  const commandListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected item into view when commandValue changes
  useEffect(() => {
    if (isOpen && commandValue && commandListRef.current) {
      // Small delay to ensure the DOM has updated with the new selected state
      setTimeout(() => {
        const selectedItem = commandListRef.current?.querySelector(
          '[data-selected="true"]',
        );
        if (selectedItem) {
          selectedItem.scrollIntoView({
            behavior: "instant",
            block: "nearest",
          });
        }
      }, 10);
    }
  }, [commandValue, isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <div className={"relative"}>
      <Command
        loop={true}
        value={commandValue}
        onValueChange={(value) => {
          if (value === "") {
            closeMenu();
          }
          setCommandValue(value);
        }}
        className="absolute bottom-full z-10 mb-2 h-fit max-h-[20dvh] min-h-16 w-full rounded-xl border border-border/40 bg-popover px-1 text-popover-foreground shadow-xs"
      >
        <CommandList ref={commandListRef}>
          <CommandEmpty>
            {prefix === "/"
              ? "No snippets found. Try a different search term."
              : "Mentions will be implemented soon."}
          </CommandEmpty>

          {prefix === "/" && filteredSnippets.length > 0 && (
            <CommandGroup heading="Snippets">
              {filteredSnippets.map((snippet) => (
                <SnippetsMenuCommandItem
                  key={snippet.id}
                  snippet={snippet}
                  onSelect={() => handleMenuNavigation("enter", editor)}
                />
              ))}
            </CommandGroup>
          )}

          {prefix === "@" && (
            <CommandGroup heading="Mentions">
              <CommandItem value="coming-soon" onSelect={() => closeMenu()}>
                <span className="text-muted-foreground italic">
                  Mentions will be implemented soon
                </span>
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
        <div className="flex items-center justify-end px-2 pb-1 text-muted-foreground text-sm">
          <div className="flex items-center gap-0.5">
            <P variant="caption">Use arrow keys to navigate</P>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleMenuNavigation("down", editor)}
            >
              <ArrowDown3 color="currentColor" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleMenuNavigation("up", editor)}
            >
              <ArrowUp3 color="currentColor" />
            </Button>
          </div>
        </div>
      </Command>
    </div>
  );
}
