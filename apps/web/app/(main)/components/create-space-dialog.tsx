"use client";

import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import { useCreateSpace } from "@/hooks/queries/client/use-spaces.mutation";
import { useSpaceListByIdUser } from "@/hooks/queries/client/use-spaces.query";
import { useSession } from "@/hooks/queries/use-session";
import { MAX_SPACES_LIMIT } from "@/lib/limits.const";
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
import { type FormEvent, type ReactNode, useState } from "react";
import { toast } from "sonner";

export default function CreateSpaceDialog({
  children,
}: { children: ReactNode }) {
  const { idUser } = useSession();
  const { data: spaceList, isPending } = useSpaceListByIdUser(idUser);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = useCreateSpace();

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Space</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Space Name*</Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter space name"
              required={true}
            />
          </div>

          {doesSpaceTitleExist(title) && (
            <div className="text-red-500 text-sm mt-4 mb-2 text-right">
              Space name already exists
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isPending ||
                !title.trim() ||
                doesSpaceTitleExist(title) ||
                isSpaceLimitReached()
              }
            >
              {isPending ? "Creating..." : "Create Space"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
