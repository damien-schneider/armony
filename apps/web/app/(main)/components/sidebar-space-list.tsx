"use client";
import { useSpaceContext } from "@/app/(main)/contexts/space-context";
import { useSpaceListByIdUser } from "@/hooks/queries/client/use-spaces.query";
import { useSession } from "@/hooks/queries/use-session";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname, useRouter } from "next/navigation";
export default function SidebarSpaceList() {
  const router = useRouter();
  const pathname = usePathname();
  const { idUser } = useSession();
  const { changeSpaceById, activeIdSpace } = useSpaceContext();
  const { data: spaceList } = useSpaceListByIdUser(idUser);

  function handleChangeSpace(spaceId: string) {
    changeSpaceById(spaceId);
    // TODO: Probably move this logic to the context
    if (pathname?.includes("/space")) {
      router.push(`/space/${spaceId}`);
    } else {
      router.push("/chat");
    }
  }

  return (
    <div>
      <TooltipProvider>
        {spaceList?.map((space) => {
          const isSpaceActive = activeIdSpace === space.id;
          return (
            <Tooltip key={space.id}>
              <TooltipTrigger asChild={true}>
                <button
                  type="button"
                  className={cn(
                    "cursor-pointer size-8 rounded-full inline-flex items-center justify-center",
                    isSpaceActive
                      ? ""
                      : "saturate-0 hover:bg-secondary hover:text-secondary-foreground",
                  )}
                  onClick={() => handleChangeSpace(space.id)}
                >
                  <span
                    className={cn(
                      isSpaceActive
                        ? "text-primary bg-primary/10 rounded-md size-7 inline-flex items-center justify-center"
                        : "",
                    )}
                  >
                    {space.emoji}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="pointer-events-none">
                {space.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
