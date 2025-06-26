"use client";
import data from "@emoji-mart/data";
import EmojiMart from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { useTheme } from "next-themes";
import { type ReactNode, useState } from "react";
export function EmojiPickerDialog({
  onEmojiSelect,
  closeOnSelect = true,
  children,
}: {
  onEmojiSelect: (emoji: string) => void;
  children: ReactNode;
  closeOnSelect?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild={true}>{children}</PopoverTrigger>
      <PopoverContent
        variant="no-style"
        className="rounded-[11px] border border-border"
      >
        {/* Both are needed as th @ts-expect-error return error in both case --' */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore: Import error in a module env */}
        <EmojiMart
          data={data}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          // @ts-expect-error: The types of the package are outdated with React 19
          onEmojiSelect={(emoji) => {
            onEmojiSelect(emoji.native);
            if (closeOnSelect) {
              setIsOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
