"use client";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { Add, Grid4, Verify } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type RefObject, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { SearchMenu } from "@/app/(main)/components/search-menu";
import SidebarChatList from "@/app/(main)/components/sidebar-chat-list";
import SidebarMessageQuota from "@/app/(main)/components/sidebar-message-quota";
import SidebarSpaceMenu from "@/app/(main)/components/sidebar-space-menu";
import { LogoArmony } from "@/components/logo-armony";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useSubscriptionByUser } from "@/hooks/queries/client/use-subscriptions.query";
import { useSession } from "@/hooks/queries/use-session";
import { useSidebarOpening } from "@/hooks/use-sidebar-opening";

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
          "fixed z-50 h-dvh transition-all duration-500 ease-in-out",
          isSidebarOpen ? "" : "-translate-x-80",
        )}
      >
        <div
          className={cn(
            "pointer-events-none flex h-full w-80 min-w-80 max-w-80 flex-col p-2 transition duration-500 ease-in-out",
            isSidebarOpen ? "opacity-100 blur-none" : "opacity-0 blur-lg",
          )}
        >
          <div className="pointer-events-auto flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border bg-background-2">
            <div className="flex items-center justify-between px-1 py-1">
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
              className="flex w-full items-center justify-between rounded-none px-6 py-5"
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
                    className="flex w-full justify-start rounded-none px-6 py-5 text-violet-500 dark:text-violet-300"
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
            <div className="flex items-center justify-end p-1">
              <ThemeSwitcher />
            </div>
          </div>
          <SidebarSpaceMenu />
        </div>
      </div>
      <div
        className={cn(
          "absolute z-60 inline-flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
          isSidebarOpen
            ? "-translate-y-12 pointer-events-none translate-x-80 opacity-0 blur-md md:translate-y-0"
            : "max-w-14 rounded-br-2xl border-r border-b bg-background-2 pl-0 md:border-0 md:bg-background ",
        )}
      >
        <div className={cn("flex h-full w-14 min-w-14 max-w-14 flex-col p-2")}>
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
