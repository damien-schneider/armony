"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ArrowDown2 } from "iconsax-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { MemoizedMarkdown } from "@/app/(main)/chat/components/memoized-markdown/memoized-markdown";

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
    <div className="mt-2 flex flex-col gap-2">
      {isReasoning ? (
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Reasoning</span>
          {/* <Spinner /> */}
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            "mt-2 inline-flex w-fit cursor-pointer items-center gap-2 transition",
            isExpanded
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="font-medium text-sm">
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
            className="relative overflow-y-hidden pl-3 text-muted-foreground text-sm"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="absolute inset-y-3 left-0 inline-block min-h-1 w-0.5 rounded-full bg-border" />

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
