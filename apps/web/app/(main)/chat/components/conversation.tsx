import { Button } from "@workspace/ui/components/button";
import {
  ScrollArea,
  ScrollAreaViewport,
} from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowDown } from "iconsax-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { AssistantMessage } from "@/app/(main)/chat/components/assistant-message";
import { UserMessage } from "@/app/(main)/chat/components/user-message";
import { useSharedAiChat } from "@/app/(main)/contexts/ai-sdk-chat-context";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-effect";

export function AiConversation() {
  const container = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messagesLength, setMessagesLength] = useState(0);
  const { messages, status } = useSharedAiChat();

  useEffect(() => {
    setMessagesLength(messages.length);
  }, [messages]);

  useEffect(() => {
    if (!messagesLength) {
      return;
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesLength]);

  if (messages.length === 0) {
    return null;
  }
  return (
    <>
      <ScrollArea className="h-full min-h-2" ref={container}>
        <ScrollAreaViewport>
          <div className="mx-auto max-w-3xl space-y-12 px-5.5 pt-12 pb-8">
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;

              if (message.role === "assistant") {
                return (
                  <AssistantMessage
                    key={`assistant-${index}-${message.id}`}
                    className={cn(
                      isLastMessage &&
                        status !== "submitted" &&
                        "min-h-[50dvh]",
                    )}
                    message={message}
                  />
                );
              }
              if (message.role === "user") {
                return (
                  <UserMessage
                    key={`user-${index}-${message.id}`}
                    className={cn(
                      isLastMessage &&
                        status !== "submitted" &&
                        "min-h-[50dvh]",
                    )}
                    message={message}
                    messageIndex={index}
                  />
                );
              }
              return null;
            })}

            {status === "submitted" && (
              <motion.div
                initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                // exit={{ opacity: 0, translateY: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="flex min-h-[50dvh] items-start"
              >
                <TextShimmerWave className="font-mono text-sm" duration={0.7}>
                  Generating response...
                </TextShimmerWave>
              </motion.div>
            )}
          </div>
        </ScrollAreaViewport>
        <div ref={messagesEndRef} className="pb-10" />
      </ScrollArea>
      {/* Conditionally render the scroll-to-bottom button */}

      <ScrollToBottomButton
        messagesEndRef={messagesEndRef}
        container={container}
      />
    </>
  );
}

const ScrollToBottomButton = ({
  messagesEndRef,
  container,
}: {
  messagesEndRef: RefObject<HTMLDivElement | null>;
  container: RefObject<HTMLDivElement | null>;
}) => {
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const isScrollAtBottom = useInView(messagesEndRef, {
    once: false,
    margin: "0px",
    root: container,
  });

  return (
    <AnimatePresence>
      {!isScrollAtBottom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="-translate-x-1/2 absolute bottom-36 left-1/2 z-10"
        >
          <Button
            onClick={scrollToBottom}
            variant="secondary"
            size={"icon"}
            className="rounded-full border border-border"
          >
            <ArrowDown color="currentColor" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
