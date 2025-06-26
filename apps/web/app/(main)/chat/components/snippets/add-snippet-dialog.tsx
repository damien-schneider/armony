"use client";

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
import { useKeyPress } from "@workspace/ui/hooks/use-key-press";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { useChatContext } from "@/app/(main)/contexts/chat-context";
import { useCreateSnippet } from "@/hooks/queries/client/use-snippets.mutation";
import { useSession } from "@/hooks/queries/use-session";

interface AddSnippetDialogProps {
  children: ReactNode;
  content: string;
}

export default function AddSnippetDialog({
  children,
  content,
}: AddSnippetDialogProps) {
  const { idUser } = useSession();
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateSnippet();

  const { inputValue } = useChatContext();

  useKeyPress({
    triggerOnContentEditable: true,
    keyPressItems: [
      {
        keys: ["Meta", "Shift", "Enter"],
        event: () => {
          if (inputValue.length > 12) {
            setIsOpen(true);
          }
        },
      },
    ],
  });

  // Reset title when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!idUser) {
      toast.error("You must be logged in to create snippets");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await mutateAsync(
        {
          title: title.trim(),
          content,
          emoji: "✂️", // Default emoji for snippets
          idUser,
        },
        {
          onSuccess: () => {
            setTitle("");
            setIsOpen(false);
            toast.success("Snippet created successfully");
          },
          onError: (error) => {
            console.error("Failed to create snippet:", error);
            toast.error("Failed to create snippet");
          },
        },
      );
    } catch (error) {
      console.error("Failed to create snippet:", error);
      toast.error("Failed to create snippet");
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Snippet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input
                autoFocus={true}
                id={`snippet-title-${idUser}`}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your snippet"
                required={true}
                value={title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="max-h-48 overflow-y-auto rounded-md border bg-background-2 p-3">
                <pre className="whitespace-pre-wrap text-sm">{content}</pre>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              disabled={isPending}
              onClick={() => setIsOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isPending || !title.trim()} type="submit">
              {isPending ? "Creating..." : "Create Snippet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
