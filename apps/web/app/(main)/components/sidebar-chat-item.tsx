"use client";
import { getModel } from "@/app/api/chat/util/ai-models-client.util";
import {
  useDeleteChat,
  useUpdateChat,
} from "@/hooks/queries/client/use-chats.mutation";
import { IconAiProvider } from "@/lib/provider-icons";
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
            variant={isActive ? "ghost-active" : "ghost"}
            className="gap-0"
          >
            <Link
              href={`/chat/${chat.id}`}
              replace={true}
              className={cn(
                "flex justify-between items-center font-base w-full rounded-none group transition-none",
              )}
            >
              <IconAiProvider
                provider={modelDetails?.provider ?? null}
                className="w-4 h-4 min-w-4 min-h-4 max-h-4 max-w-4"
              />

              <P
                className={cn(
                  "truncate flex-1 ml-2",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-foreground/70 font-medium",
                )}
              >
                {chat.title ?? "Untitled chat"}
              </P>
              <div className="items-center group-hover:inline-flex hidden">
                <Button
                  variant="ghost-2"
                  size="icon-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRename();
                  }}
                >
                  <Edit2 color="currentColor" className="size-4" />
                  <span className="sr-only">Rename</span>
                </Button>
                <Button
                  variant="ghost-destructive"
                  size="icon-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                >
                  <Trash color="currentColor" className="size-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </Link>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleRename}>
            <Edit2 color="currentColor" className="size-4" />
            <span>Rename</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onClick={handleDelete}>
            <Trash color="currentColor" className="size-4" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {/* TODO: Move this as a dialog, and the open rename in a context for optimization */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit}>
            <div className="grid gap-4 py-4">
              <Input
                id="name"
                placeholder="Chat name"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                className="w-full"
                autoFocus={true}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
                disabled={updateChat.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateChat.isPending}
                className={updateChat.isPending ? "cursor-not-allowed" : ""}
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
