"use client";
import { Sidebar } from "@/app/(main)/components/sidebar";
import { SpaceContextProvider } from "@/app/(main)/contexts/space-context";
import { useSidebarOpening } from "@/hooks/use-sidebar-opening";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { DirectInbox, Profile } from "iconsax-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

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
        isSidebarOpen ? "md:overflow-visible overflow-hidden" : "overflow-auto",
      )}
    >
      <Sidebar />
      <div
        className={cn(
          "h-full w-full relative transition-all duration-500 ease-in-out",
          isSidebarOpen
            ? "opacity-50 md:opacity-100 translate-x-80 md:translate-x-0 md:pl-80"
            : "",
        )}
      >
        {children}
        <div className="absolute inline-flex items-center gap-2 top-4 right-4">
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
