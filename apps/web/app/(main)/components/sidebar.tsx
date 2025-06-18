"use client";
import { SearchMenu } from "@/app/(main)/components/search-menu";
import SidebarChatList from "@/app/(main)/components/sidebar-chat-list";
import SidebarMessageQuota from "@/app/(main)/components/sidebar-message-quota";
import SidebarSpaceMenu from "@/app/(main)/components/sidebar-space-menu";
import { LogoArmony } from "@/components/logo-armony";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useSubscriptionByUser } from "@/hooks/queries/client/use-subscriptions.query";
import { useSession } from "@/hooks/queries/use-session";
import { useSidebarOpening } from "@/hooks/use-sidebar-opening";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { Add, Grid4, Verify } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type RefObject, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

export const Sidebar = () => {
  const { idUser } = useSession();
  const { data: subscription } = useSubscriptionByUser(idUser);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSidebarOpen, handleClickOutside, toggleSidebar } =
    useSidebarOpening();

  useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "h-dvh transition-all fixed duration-500 ease-in-out z-50",
          isSidebarOpen ? "" : "-translate-x-80",
        )}
      >
        <div
          className={cn(
            "w-80 h-full flex flex-col min-w-80 max-w-80 p-2 pointer-events-none transition duration-500 ease-in-out",
            isSidebarOpen ? "opacity-100 blur-none" : "opacity-0 blur-lg",
          )}
        >
          <div className="bg-background-2 border rounded-2xl flex flex-col justify-between h-full overflow-hidden w-full pointer-events-auto">
            <div className="flex justify-between items-center px-1 py-1">
              <Link href="/chat">
                <LogoArmony size="lg" className="ml-2 h-5 w-fit max-w-24" />
              </Link>
              <div>
                <SearchMenu />
                <Button
                  variant="ghost"
                  onClick={toggleSidebar}
                  size="icon"
                  className="rounded-tr-xl"
                >
                  <Grid4 color="currentColor" className="size-5" />
                </Button>
              </div>
            </div>
            <Separator />
            <Button
              variant="ghost"
              className="w-full px-6 py-5 flex justify-between items-center rounded-none"
              // asChild={true}
              onClick={() => {
                router.refresh();
                router.push("/chat");
              }}
            >
              {/* <Link href="/chat" replace={true}> */}
              New Chat
              <Add color="currentColor" className="size-5" />
              {/* </Link> */}
            </Button>
            <Separator />

            <SidebarChatList />

            <Separator />

            {subscription?.status !== "active" &&
              subscription?.status !== "trialing" && (
                <>
                  <SidebarMessageQuota />
                  <Button
                    variant="ghost"
                    className="w-full px-6 py-5 flex justify-start rounded-none dark:text-violet-300 text-violet-500"
                    asChild={true}
                  >
                    <Link href="/subscribe">
                      <Verify color="currentColor" className="size-5" />
                      Subscribe to Armony
                    </Link>
                  </Button>
                  <Separator />
                </>
              )}
            {/* <Button
              variant="ghost"
              className="w-full px-6 py-5 flex justify-start rounded-none"
            >
              <ArchiveBox color="currentColor" className="size-5" />
              My library
            </Button>
            <Separator />
            <Button
              variant="ghost"
              className="w-full px-6 py-5 flex justify-start rounded-none"
            >
              <Tag color="currentColor" className="size-5" />
              Manage my tags
            </Button>
            <Separator /> */}
            <div className="flex justify-end items-center p-1">
              <ThemeSwitcher />
            </div>
          </div>
          <SidebarSpaceMenu />
        </div>
      </div>
      <div
        className={cn(
          "absolute inline-flex flex-col transition-all z-60 overflow-hidden duration-500 ease-in-out",
          isSidebarOpen
            ? "pointer-events-none opacity-0 blur-md md:translate-y-0 -translate-y-12 translate-x-80"
            : "max-w-14 pl-0 bg-background-2 md:bg-background border-b border-r md:border-0 rounded-br-2xl ",
        )}
      >
        <div className={cn("w-14 h-full min-w-14 max-w-14 p-2 flex flex-col")}>
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            size="icon"
            className="mb-2"
          >
            <Grid4 color="currentColor" className="size-5" />
          </Button>

          <Button variant="ghost" size="icon" asChild={true}>
            <Link href="/chat">
              <Add color="currentColor" className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
