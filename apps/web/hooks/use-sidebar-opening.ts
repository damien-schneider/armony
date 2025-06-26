"use client";
import { useLocalStorageState } from "@workspace/ui/hooks/use-local-storage";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { localStorageKeys } from "@/lib/local-storage-keys";

export const useSidebarOpening = () => {
  const isDesktopView = useMediaQuery("(min-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorageState<boolean>(
    localStorageKeys.sidebarOpen,
    // { defaultValue: isDesktopView }, // Default value doesn't work
  );
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClickOutside = () => {
    if (!isDesktopView) {
      setIsSidebarOpen(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Adding setIsSidebarOpen to dependencies would cause infinite re-renders>
  useEffect(() => {
    if (pathname && !isDesktopView) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isDesktopView]);

  return {
    isSidebarOpen,
    toggleSidebar,
    handleClickOutside,
    isDesktopView,
  };
};
