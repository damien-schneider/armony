"use client";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { DirectInbox, Profile } from "iconsax-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "@/app/(main)/components/sidebar";
import { SpaceContextProvider } from "@/app/(main)/contexts/space-context";
import { useSidebarOpening } from "@/hooks/use-sidebar-opening";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <SpaceContextProvider>
      <MainContent>{children}</MainContent>
    </SpaceContextProvider>
  );
}

const MainContent = ({ children }: { children: ReactNode }) => {
  const { isSidebarOpen } = useSidebarOpening();
  const router = useRouter();

  return (
    <div
      className={cn(
        "h-dvh",
        // Necessary to prevent the body from scrolling when the sidebar is open on mobile
        isSidebarOpen ? "overflow-hidden md:overflow-visible" : "overflow-auto",
      )}
    >
      <Sidebar />
      <div
        className={cn(
          "relative h-full w-full transition-all duration-500 ease-in-out",
          isSidebarOpen
            ? "translate-x-80 opacity-50 md:translate-x-0 md:pl-80 md:opacity-100"
            : "",
        )}
      >
        {children}
        <div className="absolute top-4 right-4 inline-flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              window.open("https://armony.featurebase.app/", "_blank")
            }
            growingText={true}
            growingTextContent="Send Feedback"
          >
            <DirectInbox color="currentColor" className="size-5" />
          </Button>
          <Button
            variant="ghost"
            growingText={true}
            growingTextContent="My Account"
            onClick={() => router.push("/account")}
          >
            <Profile color="currentColor" className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
