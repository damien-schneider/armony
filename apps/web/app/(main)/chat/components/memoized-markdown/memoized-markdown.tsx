"use client";

import { CodeHighlight } from "@/app/(main)/chat/components/memoized-markdown/code-highlighter";
import {} from "@workspace/ui/components/scroll-area";
import { marked } from "marked";
import { motion } from "motion/react";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { isInlineCode } from "react-shiki";
function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

// Copy button component for code blocks

const initialVariant = {
  opacity: 1,
  scale: 1,
  // filter: "blur(10px)",
  // y: 10,
};
// const initialVariant = {
//   opacity: 0,
//   scale: 0.95,
//   // filter: "blur(10px)",
//   // y: 10,
// };

const animateVariant = {
  opacity: 1,
  scale: 1,
  // filter: "blur(0px)",
  // y: 0,
};

import type { PropsWithChildren } from "react";
import type { ExtraProps } from "react-markdown";

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        components={{
          blockquote: (props: PropsWithChildren<ExtraProps>) => (
            <motion.blockquote
              className="border-none flex gap-2 text-foreground relative px-4 text-pretty"
              initial={initialVariant}
              animate={animateVariant}
            >
              <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-secondary-foreground" />
              {props.children}
            </motion.blockquote>
          ),
          strong: (props: PropsWithChildren<ExtraProps>) => (
            <motion.strong
              initial={initialVariant}
              animate={animateVariant}
              className="text-secondary-foreground/70 font-semibold"
            >
              {props.children}
            </motion.strong>
          ),
          p: (props: PropsWithChildren<ExtraProps>) => {
            return (
              <motion.p
                initial={initialVariant}
                animate={animateVariant}
                className="text-secondary-foreground max-w-3xl"
              >
                {props.children}
              </motion.p>
            );
          },
          h1: (props: PropsWithChildren<ExtraProps>) => (
            <motion.h1
              initial={initialVariant}
              animate={animateVariant}
              className="text-2xl font-bold mt-6 mb-4"
            >
              {props.children}
            </motion.h1>
          ),
          h2: (props: PropsWithChildren<ExtraProps>) => (
            <motion.h2
              initial={initialVariant}
              animate={animateVariant}
              className="text-xl font-bold mt-5 mb-3"
            >
              {props.children}
            </motion.h2>
          ),
          ul: (props: PropsWithChildren<ExtraProps>) => (
            <motion.ul
              initial={initialVariant}
              animate={animateVariant}
              className="list-disc pl-5 my-3"
            >
              {props.children}
            </motion.ul>
          ),
          li: (props: PropsWithChildren<ExtraProps>) => (
            <motion.li
              initial={initialVariant}
              animate={animateVariant}
              className="my-1"
            >
              {props.children}
            </motion.li>
          ),
          code: ({
            children,
            node,
            ...rest
          }: PropsWithChildren<ExtraProps> & { node?: unknown }) => {
            const isInline =
              node && typeof node === "object" ? isInlineCode(node) : undefined;
            if (isInline) {
              return (
                <code className="text-secondary-foreground/70 font-semibold px-1.5 py-1 rounded-sm bg-secondary-foreground/5 after:content-[''] before:content-['']">
                  {children}
                </code>
              );
            }
            return <CodeHighlight {...rest}>{children}</CodeHighlight>;
          },
          pre: (props: PropsWithChildren<ExtraProps>) => (
            <pre className="p-0 bg-transparent overflow-visible">
              {props.children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) {
      return false;
    }
    return true;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${index}-${id}-_block`} />
    ));
  },
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
