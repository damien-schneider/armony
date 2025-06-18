"use client";
import { localStorageKeys } from "@/lib/local-storage-keys";
import { useLocalStorageState } from "@workspace/ui/hooks/use-local-storage";
import { useMediaQuery } from "usehooks-ts";

export const useSidebarOpening = () => {
  const isDesktopView = useMediaQuery("(min-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorageState<boolean>(
    localStorageKeys.sidebarOpen,
    // { defaultValue: isDesktopView }, // Default value doesn't work
  );

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClickOutside = () => {
    if (!isDesktopView) {
      setIsSidebarOpen(false);
    }
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    handleClickOutside,
    isDesktopView,
  };
};
