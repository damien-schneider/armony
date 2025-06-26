"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import type { Message } from "ai";
import { Edit2, Refresh2 } from "iconsax-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";
import { CopyToClipboardButton } from "@/app/(main)/chat/components/copy-button";
import { MessageEditTextarea } from "@/app/(main)/chat/components/message-edit-textarea";
import { SelectModelWithDropdown } from "@/app/(main)/chat/components/select-model-with-dropdown";
import { useSharedAiChat } from "@/app/(main)/contexts/ai-sdk-chat-context";
import { envClient } from "@/env/client";

export interface RepromptOptions {
  reprompting: boolean;
  messageIndex: number;
}

export interface ImagePreview {
  id: string;
  url: string;
}

export interface MessageWithImages extends Message {
  images?: ImagePreview[];
}

export function UserMessage({
  message,
  messageIndex,
  className,
}: {
  message: Message | MessageWithImages;
  messageIndex: number;
  className?: string;
}) {
  const { handleMessageSubmit } = useSharedAiChat();
  const messageWithImages = message as MessageWithImages;
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { height } = useResizeObserver({
    ref: ref as RefObject<HTMLDivElement>,
    box: "border-box",
  });

  useEffect(() => {
    if (messageWithImages.images && messageWithImages.images.length > 0) {
      const previews = messageWithImages.images.map((img) => {
        if (img.url) {
          return img;
        }

        return {
          id: img.id,
          url: "/images/attachment-placeholder.png",
        };
      });

      setImagePreviews(previews);
    }
  }, [messageWithImages]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (editedContent: string) => {
    if (editedContent === message.content) {
      setIsEditing(false);
      return;
    }

    handleMessageSubmit({
      content: editedContent,
      repromptOptions: {
        reprompting: true,
        messageIndex,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className={className}>
      {envClient.NEXT_PUBLIC_NODE_ENV === "development" && (
        <div className="text-neutral-500 text-xs">
          <p>Message ID: {message.id}</p>
          <p>Message Index: {messageIndex}</p>
        </div>
      )}
      <div className="mb-2 flex items-end justify-end gap-2">
        <SelectModelWithDropdown
          onSelect={(model) => {
            handleMessageSubmit({
              aiModelSlug: model,
              content: message.content,
              repromptOptions: {
                reprompting: true,
                messageIndex,
              },
            });
          }}
          imageInput={false}
          dropdownAlign="end"
        >
          Reprompt with
        </SelectModelWithDropdown>
        {/* TODO: Improve tooltip to have the same provider for copyToClipboard button and edit */}
        <CopyToClipboardButton copyContent={message.content} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild={true}>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  handleMessageSubmit({
                    content: message.content,
                    repromptOptions: {
                      reprompting: true,
                      messageIndex,
                    },
                  });
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Reprompt"
              >
                <Refresh2 color="currentColor" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reprompt</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild={true}>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleEditClick}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit message"
              >
                <Edit2 color="currentColor" className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* <p className="absolute">{height}px</p> */}
      <motion.div
        className="flex flex-col items-end"
        initial={{ opacity: 0, x: 100 }}
        ref={ref}
        animate={{ opacity: 1, x: 0 }}
      >
        {imagePreviews.length > 0 && (
          <div className="mb-2 flex max-w-2xl flex-wrap justify-end gap-2">
            {imagePreviews.map((image) => (
              <div
                key={image.id}
                className="relative h-24 w-24 overflow-hidden rounded-lg border"
              >
                <Image
                  src={image.url}
                  alt="Content uploaded by user"
                  className="h-full w-full object-cover"
                  fill={true}
                  sizes="128px"
                />
              </div>
            ))}
          </div>
        )}
        {/* <p className="text-7xl">Height: {height}</p> */}
        <AnimatePresence mode="popLayout">
          {isEditing ? (
            <MessageEditTextarea
              initialContent={message.content}
              onCancel={handleCancelEdit}
              onSave={handleSaveEdit}
              initialHeight={height}
            />
          ) : (
            <MessageComponent message={message} initialHeight={height} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const MessageComponent = ({
  message,
  initialHeight,
}: {
  message: Message | MessageWithImages;
  initialHeight?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: initialHeight }}
      animate={{
        opacity: 1,
        height: "auto",
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="prose prose-neutral dark:prose-invert w-fit max-w-full whitespace-pre-wrap rounded-2xl rounded-br-sm bg-background-2 px-4 py-2 text-foreground">
        {message.content}
      </div>
    </motion.div>
  );
};
