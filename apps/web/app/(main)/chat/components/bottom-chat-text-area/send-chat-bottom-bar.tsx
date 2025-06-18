"use client";
import { ChatTiptapAutocompleteSuggestion } from "@/app/(main)/chat/components/bottom-chat-text-area/chat-tiptap-autocomplete-suggestion";
import { ChatTiptapProvider } from "@/app/(main)/chat/components/bottom-chat-text-area/chat-tiptap-context";
import { ChatTiptapComponent } from "@/app/(main)/chat/components/bottom-chat-text-area/chat-tiptap-text-area";
import { ListSelectedImages } from "@/app/(main)/chat/components/list-selected-images";
import { SelectModelWithDropdown } from "@/app/(main)/chat/components/select-model-with-dropdown";
import AddSnippetButton from "@/app/(main)/chat/components/snippets/add-snippet-button";
import { SnippetsMenu } from "@/app/(main)/chat/components/snippets/snippets-menu";
import { useSharedAiChat } from "@/app/(main)/contexts/ai-sdk-chat-context";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import { availableModels } from "@/app/api/chat/lib/ai-models-client.lib";
import { useMessageQuotas } from "@/hooks/queries/client/use-ai-calls.query";
import { useSession } from "@/hooks/queries/use-session";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Add, Send } from "iconsax-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

export function SendChatBottomBar() {
  const { handleMessageSubmit, messages } = useSharedAiChat();
  const {
    inputValue,
    selectedFiles,
    addFiles,
    removeFile,
    model,
    tone,
    changeChatTone,
    changeChatModel,
  } = useChatContext();
  const { idUser } = useSession();
  const { data: quotas } = useMessageQuotas(idUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrlsRef = useRef<Set<string>>(new Set());
  const pathname = usePathname();
  // Clean up object URLs when disassembling components
  useEffect(() => {
    return () => {
      for (const url of imageUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  // Vérifie si le modèle actuel supporte l'entrée d'images
  const [supportsImageInput, setSupportsImageInput] = useState(false);
  useEffect(() => {
    if (model && pathname !== "/chat") {
      setSupportsImageInput(
        availableModels[model.slug]?.options.imageInput ?? false,
      );
    } else {
      setSupportsImageInput(true);
    }
  }, [model, pathname]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      addFiles(event.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    removeFile(index);
  };

  return (
    <ChatTiptapProvider>
      <div className="relative z-50">
        <motion.div
          className="rounded-2xl border bg-background-2 z-50"
          layoutId="chat-input-2"
          layout="position"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AddSnippetButton />
          {selectedFiles.length > 0 && supportsImageInput && (
            <ListSelectedImages
              images={selectedFiles.map((file) => {
                const url = URL.createObjectURL(file);
                imageUrlsRef.current.add(url);
                return {
                  id: file.name,
                  file,
                  preview: url,
                };
              })}
              onRemove={handleRemoveImage}
            />
          )}
          <SnippetsMenu />

          <ChatTiptapComponent />

          <div className="flex justify-between items-center p-1 gap-2 ">
            <div className="flex items-center gap-2">
              <Select
                value={tone}
                onValueChange={(value) => changeChatTone(value)}
              >
                <Button
                  asChild={true}
                  variant={"ghost"}
                  className="w-fit border-0"
                >
                  <SelectTrigger className="min-w-32 justify-between rounded-lg">
                    <SelectValue placeholder="Choose a style" />
                  </SelectTrigger>
                </Button>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                </SelectContent>
              </Select>

              {messages.length > 0 && (
                <SelectModelWithDropdown
                  imageInput={selectedFiles.length > 0}
                  onSelect={(model) => {
                    changeChatModel(model);
                  }}
                >
                  Select model
                </SelectModelWithDropdown>
              )}

              {supportsImageInput && (
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    multiple={true}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className={selectedFiles.length > 0 ? "text-primary" : ""}
                  >
                    <Add color="currentColor" className="size-5" />
                  </Button>
                </div>
              )}
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleMessageSubmit()}
              disabled={!inputValue || quotas?.isMessageQuotaExceeded}
            >
              <Send color="currentColor" className="size-5" />
            </Button>
          </div>
        </motion.div>
      </div>
      <ChatTiptapAutocompleteSuggestion />
    </ChatTiptapProvider>
  );
}
