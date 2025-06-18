"use client";

import CreateSpaceDialog from "@/app/(main)/components/create-space-dialog";
import SidebarSpaceList from "@/app/(main)/components/sidebar-space-list";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import { useSpaceListByIdUser } from "@/hooks/queries/client/use-spaces.query";
import { useSession } from "@/hooks/queries/use-session";
import { MAX_SPACES_LIMIT } from "@/lib/limits.const";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { P } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { Add, Setting } from "iconsax-react";
import Link from "next/link";
import { useIsClient } from "usehooks-ts";

export default function SidebarSpaceMenu() {
  const { idUser } = useSession();
  const { data: spaceList } = useSpaceListByIdUser(idUser);

  const { activeSpace } = useSpaceContext();
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative transition-all min-h-22.5 h-22.5 md:min-h-11 md:h-11 md:hover:min-h-22.5 md:hover:h-22.5 pointer-events-none">
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex flex-col bg-background-2 border rounded-xl pt-3 -z-10 mx-auto rounded-t-none w-[calc(100%-1rem)]  pointer-events-auto",
        )}
      >
        {/* Header showing active space - Upper Part */}
        <div className="flex items-center justify-between p-1 h-11">
          <div className="flex items-center gap-2 w-full">
            {activeSpace && (
              <div className="flex-shrink-0 flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                {/* TODO: Emoji should never be null */}
                {activeSpace.emoji}
              </div>
            )}
            {activeSpace ? (
              <P className="font-medium truncate">
                {/* TODO: Title should never be null */}
                {activeSpace.title}
              </P>
            ) : (
              // No active space means no spaces exist
              <CreateSpaceDialog>
                <Button
                  variant="ghost-2"
                  className="justify-center w-full rounded-b-lg rounded-t-sm"
                >
                  <Add color="currentColor" className="size-4" />
                  Create Space
                </Button>
              </CreateSpaceDialog>
            )}
          </div>
          {activeSpace && (
            <Button
              variant="ghost"
              size="icon"
              asChild={true}
              className="text-muted-foreground hover:text-primary"
            >
              <Link href={`/space/${activeSpace.id}`}>
                <Setting color="currentColor" className="size-4" />
              </Link>
            </Button>
          )}
        </div>
        <Separator />

        {/* List of spaces - Bottom Part */}
        <div className="flex items-center justify-between p-1">
          <SidebarSpaceList />
          <CreateSpaceDialog>
            {spaceList && spaceList.length >= MAX_SPACES_LIMIT ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild={true}>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={true}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Add color="currentColor" className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="pointer-events-none">
                    Maximum 5 spaces allowed
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
              >
                <Add color="currentColor" className="size-4" />
              </Button>
            )}
          </CreateSpaceDialog>
        </div>
      </div>
    </div>
  );
}
