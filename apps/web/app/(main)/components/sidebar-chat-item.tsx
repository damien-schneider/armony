"use client";
import type { Tables } from "@workspace/supabase/types/database";
import { Button } from "@workspace/ui/components/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { P } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { Edit2, Trash } from "iconsax-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { getModel } from "@/app/api/chat/util/ai-models-client.util";
import {
  useDeleteChat,
  useUpdateChat,
} from "@/hooks/queries/client/use-chats.mutation";
import { IconAiProvider } from "@/lib/provider-icons";

export const SidebarChatItem = ({ chat }: { chat: Tables<"chats"> }) => {
  const { id_chat: activeChatId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState(
    chat.title ?? "Untitled chat",
  );

  const updateChat = useUpdateChat();
  const deleteChat = useDeleteChat();
  if (!chat.model) {
    return null;
  }
  const modelDetails = getModel(chat.model);

  const handleRename = () => {
    setIsRenameDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteChat.mutateAsync({ id: chat.id });
      // Redirect to default page if we're currently viewing this chat
      if (pathname.includes(`/chat/${chat.id}`)) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleRenameSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateChat.mutateAsync({
        id: chat.id,
        title: newChatTitle.trim(),
      });
      setIsRenameDialogOpen(false);
    } catch (error) {
      toast.error("Failed to rename chat");
      console.error("Error renaming chat:", error);
    }
  };

  const isActive = activeChatId === chat.id;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild={true}>
          <Button
            asChild={true}
            className="gap-0"
            variant={isActive ? "ghost-active" : "ghost"}
          >
            <Link
              className={cn(
                "group flex w-full items-center justify-between rounded-none font-base transition-none",
              )}
              href={`/chat/${chat.id}`}
              replace={true}
            >
              <IconAiProvider
                className="h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4"
                provider={modelDetails?.provider ?? null}
              />

              <P
                className={cn(
                  "ml-2 flex-1 truncate",
                  isActive
                    ? "font-semibold text-foreground"
                    : "font-medium text-foreground/70",
                )}
              >
                {chat.title ?? "Untitled chat"}
              </P>
              <div className="hidden items-center group-hover:inline-flex">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRename();
                  }}
                  size="icon-xs"
                  variant="ghost-2"
                >
                  <Edit2 className="size-4" color="currentColor" />
                  <span className="sr-only">Rename</span>
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  size="icon-xs"
                  variant="ghost-destructive"
                >
                  <Trash className="size-4" color="currentColor" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </Link>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleRename}>
            <Edit2 className="size-4" color="currentColor" />
            <span>Rename</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleDelete} variant="destructive">
            <Trash className="size-4" color="currentColor" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {/* TODO: Move this as a dialog, and the open rename in a context for optimization */}
      <Dialog onOpenChange={setIsRenameDialogOpen} open={isRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit}>
            <div className="grid gap-4 py-4">
              <Input
                autoFocus={true}
                className="w-full"
                id={`chat-${chat.id}-title`}
                onChange={(e) => setNewChatTitle(e.target.value)}
                placeholder="Chat name"
                value={newChatTitle}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={updateChat.isPending}
                onClick={() => setIsRenameDialogOpen(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className={updateChat.isPending ? "cursor-not-allowed" : ""}
                disabled={updateChat.isPending}
                type="submit"
              >
                {updateChat.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
