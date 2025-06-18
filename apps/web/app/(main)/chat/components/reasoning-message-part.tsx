"use client";

import { MemoizedMarkdown } from "@/app/(main)/chat/components/memoized-markdown/memoized-markdown";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowDown2 } from "iconsax-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";

// Types copied from the original "ai" package (because not exported)
type ReasoningUIPart = {
  type: "reasoning";
  reasoning: string;
  details: Array<
    | {
        type: "text";
        text: string;
        signature?: string;
      }
    | {
        type: "redacted";
        data: string;
      }
  >;
};

export function ReasoningMessagePart({
  part,
  isReasoning,
  idMessage,
}: {
  part: ReasoningUIPart;
  isReasoning: boolean;
  idMessage: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variants: Variants = {
    collapsed: {
      height: 0,
      opacity: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
    },
  };

  //TODO: Later add a reasoning to chatContext, so that opening a reasoning will close the others
  useEffect(() => {
    if (isReasoning) {
      setIsExpanded(true);
    }
  }, [isReasoning]);

  return (
    <div className="flex flex-col gap-2 mt-2">
      {isReasoning ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Reasoning</span>
          {/* <Spinner /> */}
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            "w-fit mt-2 inline-flex items-center gap-2 cursor-pointer transition",
            isExpanded
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm font-medium">
            Reasoned for a few seconds
          </span>
          <ArrowDown2
            color="currentColor"
            className={cn("size-4 transition", isExpanded && "rotate-180")}
          />
        </button>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="reasoning"
            className="text-sm text-muted-foreground relative pl-3 overflow-y-hidden"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="absolute left-0 inset-y-3 w-0.5 min-h-1 inline-block rounded-full bg-border" />

            {/* {part.details.map((detail, detailIndex) =>
              detail.type === "text" ? (
                <MemoizedMarkdown
                key={`${detailIndex}-${detail.text.slice(0, 10)}`}
                id={`reasoning-${detailIndex}`}
                content={detail.text}
                />
                ) : (
                  "<redacted>"
                  ),
                  )} */}

            <MemoizedMarkdown
              id={`reasoning-${idMessage}`}
              content={part.reasoning}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
