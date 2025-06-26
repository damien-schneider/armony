"use client";

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
import { EmojiPickerDialog } from "@workspace/ui/components/emoji-picker";
import { H1 } from "@workspace/ui/components/typography";
import { Trash } from "iconsax-react";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import { ContentSpaceEditor } from "@/app/(main)/space/[id_space]/content-space-editor";
import {
  useDeleteSpace,
  useUpdateSpace,
} from "@/hooks/queries/client/use-spaces.mutation";
import {
  useSpaceById,
  useSpaceListByIdUser,
} from "@/hooks/queries/client/use-spaces.query";
import { useSession } from "@/hooks/queries/use-session";

export function UpdateSpaceForm({ idSpace }: { idSpace: string }) {
  const { data: space, isLoading } = useSpaceById(idSpace);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [title, setTitle] = useState("");

  const { mutateAsync: updateSpace, isPending } = useUpdateSpace();
  const { mutateAsync: deleteSpace, isPending: isDeleting } = useDeleteSpace();

  const { idUser } = useSession();
  const { data: spaceList } = useSpaceListByIdUser(idUser);

  const { changeSpaceById, resetSpace } = useSpaceContext();

  useEffect(() => {
    if (!(isLoading || space)) {
      toast.error("Failed to load space");
      router.push("/chat");
    }
  }, [isLoading, space, router]);

  useEffect(() => {
    if (space) {
      setTitle(space.title);
    }
  }, [space]);

  const handleUpdateTitle = async (newTitle: string) => {
    if (!newTitle.trim()) {
      return;
    }

    try {
      await updateSpace({
        id: idSpace,
        title: newTitle,
      });

      toast.success("Space title updated successfully");
    } catch (error) {
      console.error("Failed to update space:", error);
      toast.error("Failed to update space");

      // Reset to the original title if update fails
      if (titleRef.current && space) {
        titleRef.current.innerText = space.title;
        setTitle(space.title);
      }
    }
  };

  const handleUpdateEmoji = async (newEmoji: string) => {
    try {
      await updateSpace({
        id: idSpace,
        title,
        emoji: newEmoji,
      });

      toast.success("Space emoji updated successfully");
    } catch (error) {
      console.error("Failed to update space emoji:", error);
      toast.error("Failed to update space emoji");
    }
  };

  const handleTitleChange = () => {
    if (titleRef.current) {
      const newTitle = titleRef.current.innerText;
      setTitle(newTitle);
    }
  };

  const handleTitleBlur = () => {
    if (
      titleRef.current &&
      space &&
      titleRef.current.innerText !== space.title
    ) {
      handleUpdateTitle(titleRef.current.innerText);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLHeadingElement>) => {
    // Prevent Enter key from creating new line
    if (e.key === "Enter") {
      e.preventDefault();
      titleRef.current?.blur();
    }
  };

  const handleDeleteSpace = async () => {
    await deleteSpace(
      { id: idSpace },
      {
        onSuccess: () => {
          const updatedSpaceList = spaceList?.filter(
            (space) => space.id !== idSpace,
          );
          if (updatedSpaceList?.[0]?.id) {
            changeSpaceById(updatedSpaceList[0].id);
          } else {
            resetSpace();
          }

          router.push("/chat");
        },
        onError: () => {
          toast.error("Failed to delete space");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">Loading space details...</div>
    );
  }

  if (!space) {
    return <div className="flex justify-center py-8">Space not found</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="flex items-center gap-2">
        <EmojiPickerDialog onEmojiSelect={handleUpdateEmoji}>
          <Button size="icon-lg" variant="secondary">
            <span className="cursor-pointer text-2xl transition-opacity hover:opacity-70">
              {space.emoji}
            </span>
          </Button>
        </EmojiPickerDialog>
        <H1 className="w-full">
          {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
          <span
            className="px-1 outline-none"
            contentEditable="plaintext-only"
            onBlur={handleTitleBlur}
            onInput={handleTitleChange}
            onKeyDown={handleKeyDown}
            ref={titleRef}
            suppressContentEditableWarning={true}
          >
            {space.title}
          </span>
          {isPending && (
            <span className="ml-2 text-muted-foreground text-sm">
              Saving...
            </span>
          )}
        </H1>
        <AlertDialog>
          <AlertDialogTrigger asChild={true}>
            <Button size="sm" variant="destructive">
              <Trash color="currentColor" />
              Delete Space
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                space &quot;{space.title}&quot; and all its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
                onClick={handleDeleteSpace}
              >
                {isDeleting ? "Deleting..." : "Delete Space"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ContentSpaceEditor space={space} />
    </div>
  );
}
