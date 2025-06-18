"use client";
import { CopyToClipboardButton } from "@/app/(main)/chat/components/copy-button";
import { cn } from "@workspace/ui/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { JSX, ReactNode } from "react";
import ShikiHighlighter, { type Element } from "react-shiki";
// Using full path to avoid file extension requirement issues

const LANGUAGE_REGEX = /language-(\w+)/;
const LINE_HEIGHT_PX = 24; // Estimated line height in pixels
const MIN_LINES = 2; // Minimum number of lines to show

/**
 * Calculates the number of lines in a string by counting newlines
 */
const calculateLineCount = (content: string): number => {
  if (!content) {
    return MIN_LINES;
  }
  return content.split("\n").length;
};

/**
 * Calculates minimum height based on line count
 */
const calculateMinHeight = (lineCount: number): number => {
  return Math.max(lineCount, MIN_LINES) * LINE_HEIGHT_PX;
};

export const CodeHighlight = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
  node?: Element;
}): JSX.Element => {
  const { resolvedTheme } = useTheme();
  const match = className?.match(LANGUAGE_REGEX);
  const language = match ? match[1] : undefined;
  const [isLoading, setIsLoading] = useState(true);

  // Calculate line count and min height
  const content = String(children);
  const lineCount = calculateLineCount(content);
  const minHeight = calculateMinHeight(lineCount);

  // Set loading to false after component mounts
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="relative mt-4 mb-2">
      <div
        className={cn(
          "transition-opacity duration-200",
          isLoading ? "opacity-50" : "opacity-100",
        )}
        style={{ minHeight: `${minHeight}px` }}
      >
        <ShikiHighlighter
          langClassName="text-muted-foreground! absolute! -top-3! right-2! bg-background-2! px-2 py-0.5 rounded-t-sm border-t text-xs font-medium select-none"
          language={language}
          theme={resolvedTheme === "dark" ? "one-dark-pro" : "one-light"}
          className={cn(
            "[&_pre]:rounded-3xl! [&_pre]:bg-background-2! ",
            className,
          )}
          {...props}
        >
          {content}
        </ShikiHighlighter>
      </div>
      <div className="absolute w-10 top-0 bottom-0 right-0 pointer-events-none z-20">
        <div className="size-full relative pb-12">
          <div className="sticky top-12 right-2 pointer-events-auto">
            <CopyToClipboardButton
              className="absolute top-2 right-2"
              copyContent={content}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
