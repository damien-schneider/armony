"use client";

import { marked } from "marked";
import { motion } from "motion/react";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { isInlineCode } from "react-shiki";
import { CodeHighlight } from "@/app/(main)/chat/components/memoized-markdown/code-highlighter";

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
              animate={animateVariant}
              className="relative flex gap-2 text-pretty border-none px-4 text-foreground"
              initial={initialVariant}
            >
              <div className="absolute top-2 bottom-2 left-0 w-1 rounded-full bg-secondary-foreground" />
              {props.children}
            </motion.blockquote>
          ),
          strong: (props: PropsWithChildren<ExtraProps>) => (
            <motion.strong
              animate={animateVariant}
              className="font-semibold text-secondary-foreground/70"
              initial={initialVariant}
            >
              {props.children}
            </motion.strong>
          ),
          p: (props: PropsWithChildren<ExtraProps>) => {
            return (
              <motion.p
                animate={animateVariant}
                className="max-w-3xl text-secondary-foreground"
                initial={initialVariant}
              >
                {props.children}
              </motion.p>
            );
          },
          h1: (props: PropsWithChildren<ExtraProps>) => (
            <motion.h1
              animate={animateVariant}
              className="mt-6 mb-4 font-bold text-2xl"
              initial={initialVariant}
            >
              {props.children}
            </motion.h1>
          ),
          h2: (props: PropsWithChildren<ExtraProps>) => (
            <motion.h2
              animate={animateVariant}
              className="mt-5 mb-3 font-bold text-xl"
              initial={initialVariant}
            >
              {props.children}
            </motion.h2>
          ),
          ul: (props: PropsWithChildren<ExtraProps>) => (
            <motion.ul
              animate={animateVariant}
              className="my-3 list-disc pl-5"
              initial={initialVariant}
            >
              {props.children}
            </motion.ul>
          ),
          li: (props: PropsWithChildren<ExtraProps>) => (
            <motion.li
              animate={animateVariant}
              className="my-1"
              initial={initialVariant}
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
                <code className="rounded-sm bg-secondary-foreground/5 px-1.5 py-1 font-semibold text-secondary-foreground/70 before:content-[''] after:content-['']">
                  {children}
                </code>
              );
            }
            return <CodeHighlight {...rest}>{children}</CodeHighlight>;
          },
          pre: (props: PropsWithChildren<ExtraProps>) => (
            <pre className="overflow-visible bg-transparent p-0">
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
