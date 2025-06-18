"use client";

import { useUpdateSnippet } from "@/hooks/queries/client/use-snippets.mutation";
import { useSession } from "@/hooks/queries/use-session";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

interface EditSnippetDialogProps {
  children: ReactNode;
  snippetId: string;
  initialTitle: string;
  initialContent: string;
}

export function EditSnippetDialog({
  children,
  snippetId,
  initialTitle,
  initialContent,
}: EditSnippetDialogProps) {
  const { idUser } = useSession();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateSnippet();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [isOpen, initialTitle, initialContent]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!idUser) {
      toast.error("You must be logged in to update snippets");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    await mutateAsync(
      {
        id: snippetId,
        title: title.trim(),
        content,
        idUser,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success("Snippet updated successfully");
        },
        onError: (error) => {
          console.error("Failed to update snippet:", error);
          toast.error("Failed to update snippet");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Snippet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label className="flex flex-col items-start gap-2">
              Title*
              <Input
                value={title}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your snippet"
                required={true}
                autoFocus={true}
              />
            </Label>

            <Label className="flex flex-col items-start gap-2">
              Content
              <Textarea
                value={content}
                onChange={(e) => {
                  e.stopPropagation();
                  setContent(e.target.value);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                className="w-full resize-none bg-transparent outline-none"
                rows={5}
              />
            </Label>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !title.trim()}>
              {isPending ? "Updating..." : "Update Snippet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
