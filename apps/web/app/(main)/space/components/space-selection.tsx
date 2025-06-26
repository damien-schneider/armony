"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Add } from "iconsax-react";
import { useRouter } from "next/navigation";
import CreateSpaceDialog from "@/app/(main)/components/create-space-dialog";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";

interface Space {
  id: string;
  title: string;
  emoji: string;
}

interface SpaceSelectionProps {
  spaces: Space[];
}

export function SpaceSelection({ spaces }: SpaceSelectionProps) {
  const { changeSpaceById, activeIdSpace } = useSpaceContext();
  const router = useRouter();

  const handleSpaceSelect = (spaceId: string) => {
    changeSpaceById(spaceId);
    router.push("/chat");
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex w-full max-w-3xl flex-wrap justify-center gap-8">
        {spaces.map((space) => (
          <button
            key={space.id}
            type="button"
            className={cn(
              "group flex items-center gap-4 rounded-lg px-4 py-3 transition-colors",
              activeIdSpace === space.id ? "bg-primary/10" : "hover:bg-accent",
            )}
            onClick={() => handleSpaceSelect(space.id)}
          >
            <span className="text-2xl">{space.emoji}</span>
            <span className="font-medium text-foreground text-lg">
              {space.title}
            </span>
          </button>
        ))}
      </div>
      <CreateSpaceDialog>
        <Button variant="secondary" className="gap-2">
          <Add color="currentColor" className="size-4" />
          Create New Space
        </Button>
      </CreateSpaceDialog>
    </div>
  );
}
