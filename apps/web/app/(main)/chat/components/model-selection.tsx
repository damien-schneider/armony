"use client";
import { Button } from "@workspace/ui/components/button";
import {
  ScrollArea,
  ScrollAreaViewport,
} from "@workspace/ui/components/scroll-area";
import { P } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { differenceInDays, startOfToday } from "date-fns";
import { Send2 } from "iconsax-react";
import { useInView } from "motion/react";
import { type CSSProperties, useRef } from "react";
import { useSharedAiChat } from "@/app/(main)/contexts/ai-sdk-chat-context";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import type { AiModelSpecificity } from "@/app/api/chat/ai-models.type";
import {
  availableModels,
  modelCategories,
  modelCategoryList,
  providerDetailsList,
} from "@/app/api/chat/lib/ai-models-client.lib";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { useMessageQuotas } from "@/hooks/queries/client/use-ai-calls.query";
import { useSession } from "@/hooks/queries/use-session";
import { IconAiProvider } from "@/lib/provider-icons";

/**
 * Displays a category of models with a title and selectable model buttons
 */
function ModelCategory({
  title,
  modelSpecificity,
}: {
  title: string;
  modelSpecificity: AiModelSpecificity;
}) {
  const { idUser } = useSession();
  const { selectedFiles } = useChatContext();
  const { handleMessageSubmit } = useSharedAiChat();
  const { data: quotas } = useMessageQuotas(idUser);
  const filteredModels = Object.values(availableModels).filter(
    (model) =>
      model.specificity.includes(modelSpecificity) &&
      (selectedFiles.length === 0 || model.options.imageInput),
  );

  return (
    <div className="flex flex-col justify-end">
      <P className="-top-1 sticky z-1 rounded-b-lg bg-background px-2 py-1 font-medium text-muted-foreground text-sm">
        {title}
      </P>
      <div className="space-y-1 p-1">
        {filteredModels.map((model) => (
          <Button
            key={model.slug}
            disabled={quotas?.isMessageQuotaExceeded}
            variant="secondary"
            className={cn(
              "group w-full cursor-pointer justify-start border-0",
              "ring-0 ring-[var(--provider-color-light)] ring-solid ring-offset-0 transition hover:bg-[var(--provider-color-light)]/10 hover:text-[var(--provider-color-light)] hover:ring-2 dark:ring-[var(--provider-color-dark)] dark:hover:bg-[var(--provider-color-dark)]/10 dark:hover:text-[var(--provider-color-dark)]",
            )}
            style={
              {
                "--provider-color-light":
                  providerDetailsList[model.provider].color.light,
                "--provider-color-dark":
                  providerDetailsList[model.provider].color.dark,
              } as CSSProperties
            }
            // onMouseEnter={(e) => {
            //   const target = e.currentTarget;
            //   target.style.borderColor = providerDetails[model.provider].color;
            // }}
            // onMouseLeave={(e) => {
            //   const target = e.currentTarget;
            //   target.style.borderColor = "";
            // }}
            onClick={() => {
              if (handleMessageSubmit) {
                handleMessageSubmit({
                  aiModelSlug: model.slug,
                });
              }
            }}
          >
            <IconAiProvider provider={model.provider} className="mr-2 size-4" />
            <span className="w-full truncate text-left">{model.name}</span>
            {differenceInDays(startOfToday(), model.releaseDate) < 15 && (
              <TextShimmer
                duration={1.2}
                className="font-medium text-sm [--base-color:var(--color-amber-600)] [--base-gradient-color:var(--color-amber-200)] dark:[--base-color:var(--color-amber-500)] dark:[--base-gradient-color:var(--color-amber-400)]"
              >
                New
              </TextShimmer>
            )}
            <Send2
              color="currentColor"
              variant="Bulk"
              className="ml-auto hidden group-hover:block"
            />
          </Button>
        ))}
      </div>
    </div>
  );
}

/**
 * Displays a grid with different model categories to choose from
 */
export function ModelSelectionGrid() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isScrollAtBottom = useInView(messagesEndRef, {
    amount: "all",
    once: false,
    margin: "0px",
    root: scrollAreaRef,
  });

  return (
    <div className="@container w-full max-w-3xl px-4 sm:px-2">
      <ScrollArea className="" ref={scrollAreaRef}>
        <ScrollAreaViewport className="max-h-[70dvh] rounded-lg pb-6">
          <div
            className={cn(
              "pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-30 bg-gradient-to-b from-transparent to-background transition-opacity duration-300",
              isScrollAtBottom ? "opacity-0" : "opacity-100",
            )}
          />

          <div className="grid @4xl:grid-cols-4 @sm:grid-cols-1 @xl:grid-cols-2 gap-4">
            {modelCategoryList.map((category) => (
              <ModelCategory
                key={modelCategories[category].slug}
                title={modelCategories[category].name}
                modelSpecificity={category}
              />
            ))}
          </div>
          <div ref={messagesEndRef} className="my-2" />
        </ScrollAreaViewport>
      </ScrollArea>
    </div>
  );
}

/**
 * Component displayed when chat has no messages, prompting user to select a model
 */
export function EmptyChatModelSelection() {
  // const { inputValue } = useChatContext();
  return (
    <div className="flex flex-col items-center">
      <P className="mb-4 text-muted-foreground">
        Choose a model to start your conversation
      </P>
      <ModelSelectionGrid />
    </div>
  );
}
