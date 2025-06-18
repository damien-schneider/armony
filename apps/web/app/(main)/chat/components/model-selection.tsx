"use client";
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
    <div className="">
      <P className="text-sm text-muted-foreground font-medium sticky -top-1 rounded-b-lg bg-background px-2 py-1 z-1">
        {title}
      </P>
      <div className="space-y-1 p-1">
        {filteredModels.map((model) => (
          <Button
            key={model.slug}
            disabled={quotas?.isMessageQuotaExceeded}
            variant="secondary"
            className={cn(
              "justify-start group w-full border-0 cursor-pointer",
              "ring-[var(--provider-color-light)] dark:ring-[var(--provider-color-dark)] hover:ring-2 ring-0 ring-offset-0 ring-solid transition dark:hover:text-[var(--provider-color-dark)] hover:text-[var(--provider-color-light)] hover:bg-[var(--provider-color-light)]/10 dark:hover:bg-[var(--provider-color-dark)]/10",
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
            <IconAiProvider provider={model.provider} className="size-4 mr-2" />
            <span className="text-left truncate w-full">{model.name}</span>
            {differenceInDays(startOfToday(), model.releaseDate) < 15 && (
              <TextShimmer
                duration={1.2}
                className="text-sm font-medium [--base-color:var(--color-amber-600)] [--base-gradient-color:var(--color-amber-200)] dark:[--base-color:var(--color-amber-500)] dark:[--base-gradient-color:var(--color-amber-400)]"
              >
                New
              </TextShimmer>
            )}
            <Send2
              color="currentColor"
              variant="Bulk"
              className="group-hover:block hidden ml-auto"
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
    <div className="px-4 sm:px-2">
      <ScrollArea className="" ref={scrollAreaRef}>
        <ScrollAreaViewport className="rounded-lg max-h-[40dvh] pb-6">
          <div
            className={cn(
              "absolute left-0 right-0 bottom-0 h-30 bg-gradient-to-b from-transparent to-background z-20 pointer-events-none transition-opacity duration-300",
              isScrollAtBottom ? "opacity-0" : "opacity-100",
            )}
          />

          <div className="grid sm:grid-cols-2  grid-cols-1 max-w-108 gap-4">
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
  const { inputValue } = useChatContext();
  return (
    <div className="flex items-center justify-center flex-col">
      <P className="text-muted-foreground mb-4">
        Choose a model to start your conversation
      </P>
      {inputValue && <ModelSelectionGrid />}
    </div>
  );
}
