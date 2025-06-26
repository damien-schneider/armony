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
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import { toast } from "sonner";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import { useCreateSpace } from "@/hooks/queries/client/use-spaces.mutation";
import { useSpaceListByIdUser } from "@/hooks/queries/client/use-spaces.query";
import { useSession } from "@/hooks/queries/use-session";
import { MAX_SPACES_LIMIT } from "@/lib/limits.const";

export default function CreateSpaceDialog({
  children,
}: {
  children: ReactNode;
}) {
  const { idUser } = useSession();
  const { data: spaceList, isPending } = useSpaceListByIdUser(idUser);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useCreateSpace();
  const uniqueId = useId();
  const { changeSpaceById } = useSpaceContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!idUser) {
      throw new Error("User ID is not defined");
    }
    if (!title.trim()) {
      return;
    }

    mutate(
      {
        title: title,
        emoji: "🪐",
        idUser,
      },
      {
        onSuccess: (newSpace) => {
          setTitle("");
          setIsOpen(false);
          changeSpaceById(newSpace.id);
          router.push(`/space/${newSpace.id}`);
        },
        onError: () => {
          toast.error("Failed to create space");
        },
      },
    );
  };

  function doesSpaceTitleExist(title: string) {
    if (!spaceList) {
      return false;
    }
    return spaceList?.some((space) => space.title === title);
  }

  function isSpaceLimitReached() {
    if (!spaceList) {
      return false;
    }
    return spaceList.length >= MAX_SPACES_LIMIT;
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Space</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Space Name*</Label>
            <Input
              id={`name_${uniqueId}`}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter space name"
              required={true}
              value={title}
            />
          </div>

          {doesSpaceTitleExist(title) && (
            <div className="mt-4 mb-2 text-right text-red-500 text-sm">
              Space name already exists
            </div>
          )}

          <DialogFooter>
            <Button
              disabled={
                isPending ||
                !title.trim() ||
                doesSpaceTitleExist(title) ||
                isSpaceLimitReached()
              }
              type="submit"
            >
              {isPending ? "Creating..." : "Create Space"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
