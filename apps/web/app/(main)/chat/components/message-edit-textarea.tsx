"use client";

import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { Check, CloseCircle } from "iconsax-react";
import { motion } from "motion/react";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDebounceValue, useIsClient } from "usehooks-ts";

interface MessageEditTextareaProps {
  initialContent: string;
  onCancel: () => void;
  onSave: (content: string) => void;
  initialHeight?: number;
  autoFocus?: boolean;
}

export function MessageEditTextarea({
  initialContent,
  onCancel,
  onSave,
  initialHeight,
  autoFocus = true,
}: MessageEditTextareaProps) {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isClient = useIsClient();
  const [debouncedInitialHeight, _setDebouncedInitialHeight] = useDebounceValue(
    initialHeight,
    300,
  );

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [autoFocus]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (content.trim()) {
        onSave(content);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn(
        "flex h-full w-full flex-col gap-2 transition-all duration-300 ease-in-out",
        // isClient ? "max-h-32" : "max-h-12",
      )}
      style={{ maxHeight: isClient ? "128px" : `${debouncedInitialHeight}px` }}
    >
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[100px] w-full resize-none rounded-xl bg-background-2 transition-all duration-300 focus-visible:ring-primary/40"
      />
      <motion.div
        className="flex justify-end gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <CloseCircle color="currentColor" className="size-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim()}
          className="flex items-center gap-1"
        >
          <Check color="currentColor" className="size-4" />
          Save
        </Button>
      </motion.div>
    </form>
  );
}
