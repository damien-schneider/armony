import { useCompletion } from "@ai-sdk/react";
import { useKeyPress } from "@workspace/ui/hooks/use-key-press";
import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useChatTiptapContext } from "@/app/(main)/chat/components/bottom-chat-text-area/chat-tiptap-context";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import { TextEffect } from "@/components/motion-primitives/text-effect";

const doesStringEndsWithWhitespace = (str: string) => {
  const trimmedStr = str.trimEnd();
  return str.length !== trimmedStr.length;
};

export function ChatTiptapAutocompleteSuggestion() {
  const { inputValue } = useChatContext();

  const { editor, appendTextToEditor } = useChatTiptapContext();

  // Handle message submission

  const {
    completion,
    setCompletion,
    input: inputCompletion,
    setInput: setInputCompletion,
    handleSubmit: handleCompletionSubmit,
    isLoading: isCompletionLoading,
    stop: stopCompletion,
  } = useCompletion({
    api: "/api/completion",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Create weird effect as it is triggered by the stopCompletion otherwise>
  useEffect(() => {
    if (inputValue) {
      setCompletion("");
      stopCompletion();
    }
    setCompletion("");
    stopCompletion();
  }, [inputValue]);

  const [debouncedInput, _] = useDebounceValue(inputValue, 100);

  useEffect(() => {
    setInputCompletion(debouncedInput);
  }, [debouncedInput, setInputCompletion]);
  useEffect(() => {
    if (
      inputCompletion &&
      inputCompletion.length > 3 &&
      doesStringEndsWithWhitespace(inputCompletion)
    ) {
      handleCompletionSubmit();
    }
  }, [inputCompletion, handleCompletionSubmit]);

  const handleAcceptSuggestion = () => {
    if (completion) {
      appendTextToEditor(completion);
    }
  };

  const handleRejectSuggestion = () => {
    setInputCompletion("");
    setCompletion("");
    stopCompletion();
  };

  useKeyPress({
    keyPressItems: [
      {
        keys: ["Tab"],
        event: (e) => {
          if (completion) {
            e.preventDefault();
            handleAcceptSuggestion();
          }
        },
      },
      {
        keys: ["Escape"],
        event: (e) => {
          if (completion) {
            e.preventDefault();
            handleRejectSuggestion();
          }
        },
      },
    ],
    tagsToIgnore: [],
    triggerOnContentEditable: true,
  });

  if (!editor) {
    return null;
  }

  return (
    <AnimatePresence>
      {completion && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.1 }}
          className={cn(
            "absolute bottom-[calc(100%-16px)] left-0 z-10 w-full px-3 *:pb-5",
            isCompletionLoading && "opacity-60",
          )}
        >
          <div className="flex w-full items-center gap-2 rounded-t-xl border-border border-x border-t bg-background py-1 pr-1 pl-3 text-sm">
            <TextEffect
              preset="fade-in-blur"
              className="line-clamp-2 w-full overflow-visible"
              // speedReveal={1.1}
              // speedSegment={0.3}
              delay={0.1}
            >
              {/* <span className="flex-1 line-clamp-2 text-muted-foreground"> */}
              {completion}
              {/* </span> */}
            </TextEffect>
            <button
              type="button"
              tabIndex={-1}
              className="ml-2 rounded px-2 py-1 font-medium text-primary text-xs transition hover:bg-primary/10"
              onClick={handleAcceptSuggestion}
            >
              Tab
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="ml-1 rounded rounded-tr-lg px-2 py-1 font-medium text-muted-foreground text-xs transition hover:bg-muted"
              onClick={handleRejectSuggestion}
            >
              Esc
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
