"use client";

import type { Tables } from "@workspace/supabase/types/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { CommandItem } from "@workspace/ui/components/command";
import { Edit2, Trash } from "iconsax-react";
import { toast } from "sonner";

import { EditSnippetDialog } from "@/app/(main)/chat/components/snippets/edit-snippet-dialog";
import { useDeleteSnippet } from "@/hooks/queries/client/use-snippets.mutation";
import { useSession } from "@/hooks/queries/use-session";

export function SnippetsMenuCommandItem({
  snippet,
  onSelect,
}: {
  snippet: Pick<Tables<"snippets">, "id" | "title" | "content">;
  onSelect: (content: string) => void;
}) {
  const { idUser } = useSession();

  const { mutateAsync: deleteSnippet } = useDeleteSnippet();

  return (
    <CommandItem
      className="group flex items-center justify-between rounded-md"
      onSelect={() => onSelect(snippet.id)}
      value={snippet.id}
    >
      <span>
        <span className="inline-flex w-full justify-between font-medium">
          <span className="truncate">{snippet.title}</span>
        </span>
        <span className="ml-2 line-clamp-1 text-muted-foreground text-sm">
          {snippet.content}
        </span>
      </span>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
      <div
        className="hidden items-center gap-1 group-data-[selected=true]:inline-flex"
        onClick={(e) => e.stopPropagation()}
      >
        <EditSnippetDialog
          initialContent={snippet.content}
          initialTitle={snippet.title}
          snippetId={snippet.id}
        >
          <Button size="icon-sm" variant="ghost">
            <Edit2 color="currentColor" />
          </Button>
        </EditSnippetDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild={true}>
            <Button size="icon-sm" variant="ghost">
              <Trash color="currentColor" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the snippet &quot;{snippet.title}
                &quot;. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  // Move this logic into the useMutation
                  if (!idUser) {
                    toast.error("You must be logged in to delete snippets");
                    return;
                  }
                  await deleteSnippet(
                    { id: snippet.id, idUser },
                    {
                      onError: (error) => {
                        console.error("Failed to delete snippet:", error);
                        toast.error("Failed to delete snippet");
                      },
                    },
                  );
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CommandItem>
  );
}
