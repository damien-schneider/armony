import { AssistantImageMessage } from "@/app/(main)/chat/components/assistant-image-message";
import { CopyToClipboardButton } from "@/app/(main)/chat/components/copy-button";
import { MemoizedMarkdown } from "@/app/(main)/chat/components/memoized-markdown/memoized-markdown";
import { ReasoningMessagePart } from "@/app/(main)/chat/components/reasoning-message-part";
import { useSharedAiChat } from "@/app/(main)/contexts/ai-sdk-chat-context";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import { TextShimmerWave } from "@/components/motion-primitives/text-shimmer-effect";
import { cn } from "@workspace/ui/lib/utils";
// import { Slider } from "@workspace/ui/components/slider";
import type { Message } from "ai";
import { motion } from "motion/react";
import Link from "next/link";
import type { ComponentProps } from "react";

export function AssistantMessage({
  message,

  className,
  ...props
}: {
  message: Message;
} & ComponentProps<"div">) {
  const { status } = useSharedAiChat();
  const { model } = useChatContext();

  const isSearchingOnTheWeb =
    status === "streaming" &&
    model.specificity === "web-search" &&
    message.parts &&
    message.parts.length === 1;

  return (
    <div className={className} {...props}>
      <div className="flex items-end gap-2">
        {/* <div>
          <p className="text-xs text-muted-foreground mb-0.5 ml-1">
            Adjust Length
          </p>
          <div className="w-24 py-3 px-3 items-center justify-center inline-flex bg-background-2/80 backdrop-blur-sm rounded-lg text-center">
            <Slider className="w-full" defaultValue={[50]} variant="soft" />
          </div>
        </div> */}
        <CopyToClipboardButton copyContent={message.content} />
      </div>
      <div
        className={cn(
          "text-secondary-foreground max-w-3xl",
          "prose prose-neutral dark:prose-invert", //TODO: To remove little by little
        )}
      >
        {/* If message contain parts, it is a reasoning message */}
        {message.parts?.map((part, index) => {
          const key = `${part.type}-${message.createdAt}-${message.id}-${index}`;
          switch (part.type) {
            case "text":
              return (
                <MemoizedMarkdown
                  key={key}
                  id={message.id}
                  content={part.text}
                />
              );
            case "source":
              return (
                <Link key={key} href={part.source.url} className="block">
                  {part.source.title}
                </Link>
              );
            case "reasoning":
              return (
                <ReasoningMessagePart
                  key={key}
                  part={part}
                  idMessage={message.id}
                  isReasoning={
                    status === "streaming" &&
                    index === (message.parts?.length ?? 0) - 1 // Last part
                  }
                />
              );
            case "tool-invocation": {
              const toolInvocation = part.toolInvocation;
              if (toolInvocation.toolName === "generateImage") {
                if (
                  toolInvocation.state === "result" &&
                  toolInvocation.result?.imagePath
                ) {
                  return (
                    <AssistantImageMessage
                      key={toolInvocation.toolCallId}
                      imagePath={toolInvocation.result.imagePath}
                      alt={toolInvocation.result.prompt || "Generated image"}
                    />
                  );
                }
                return (
                  <motion.div
                    key={toolInvocation.toolCallId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TextShimmerWave className="font-mono text-sm" duration={1}>
                      Generating image...
                    </TextShimmerWave>
                  </motion.div>
                );
              }
              // if (toolInvocation.toolName === "webSearchPreview") {
              //   if (toolInvocation.state === "result") {
              //     return (
              //       <div key={toolInvocation.toolCallId}>
              //         {toolInvocation.result?.preview}
              //       </div>
              //     );
              //   }
              //   return (
              //     <motion.div
              //       key={toolInvocation.toolCallId}
              //       initial={{ opacity: 0, translateX: 20 }}
              //       animate={{ opacity: 1, translateX: 0 }}
              //       transition={{ duration: 0.5 }}
              //       className="flex items-center"
              //     >
              //       <TextShimmerWave className="font-mono text-sm" duration={1}>
              //         Searching on the web...
              //       </TextShimmerWave>
              //     </motion.div>
              //   );
              // }
              return <div key={key}>{toolInvocation.toolName}</div>;
            }
            case "file": {
              // if (part.mimeType.startsWith("image/")) {
              //   return (
              //     <AssistantImageMessage
              //       key={key}
              //       src={`data:${part.mimeType};base64,${part.data}`}
              //       alt="Image from AI"
              //     />
              //   );
              // }
              console.error("Unknown file type:", part.mimeType);
              return null;
            }
            case "step-start": {
              return null;
            }
            default: {
              // console.error("Unknown part type:", part.type);
              return null;
            }
          }
        })}
      </div>

      {isSearchingOnTheWeb && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TextShimmerWave className="font-mono text-sm" duration={1}>
            Searching on the web...
          </TextShimmerWave>
        </motion.div>
      )}
    </div>
  );
}
