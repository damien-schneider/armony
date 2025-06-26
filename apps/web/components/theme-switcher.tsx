"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Monitor, Moon, Sun1 } from "iconsax-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useIsClient } from "usehooks-ts";

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { setTheme, theme: activeTheme } = useTheme();
  const listOfThemes = ["light", "dark", "system"] as const;
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(
    activeTheme as string,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, width: 0 });
  const isClient = useIsClient();

  // Update position when active theme changes or on initial render
  // (AI GENERATED)
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const activeButton = containerRef.current.querySelector(
      `[data-theme="${activeTheme}"]`,
    );
    if (activeButton instanceof HTMLElement) {
      const rect = activeButton.getBoundingClientRect();
      // const containerRect = containerRef.current.getBoundingClientRect();

      setPosition({
        left: activeButton.offsetLeft,
        width: rect.width,
      });
    }
  }, [activeTheme]);

  // Update position on hover
  useEffect(() => {
    if (!isClient) {
      return;
    }
    if (!(containerRef.current && hoveredTheme)) {
      return;
    }

    const hoveredButton = containerRef.current.querySelector(
      `[data-theme="${hoveredTheme}"]`,
    );

    if (hoveredButton instanceof HTMLElement) {
      const rect = hoveredButton.getBoundingClientRect();

      setPosition({
        left: hoveredButton.offsetLeft,
        width: rect.width,
      });
    }
  }, [hoveredTheme, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <>
    <div
      className={cn(
        "group relative inline-flex items-center gap-1 rounded-full p-0.5",
        className,
      )}
      onMouseLeave={() => setHoveredTheme(activeTheme ?? null)}
      ref={containerRef}
    >
      <div
        className="absolute rounded-full bg-neutral-400/20 transition-all duration-300 ease-out"
        style={{
          left: position.left,
          width: position.width,
          height: "24px",
          top: "2px",
        }}
      />

      {listOfThemes.map((themeInList) => {
        return (
          <button
            className={cn(
              "relative z-10 inline-grid size-6 cursor-pointer place-content-center transition-all duration-300",
              activeTheme === themeInList
                ? "text-foreground"
                : "text-muted-foreground",
            )}
            data-theme={themeInList}
            key={themeInList}
            onClick={() => {
              setTheme(themeInList);
            }}
            onMouseEnter={() => setHoveredTheme(themeInList)}
            type="button"
          >
            {themeInList === "system" && (
              <Monitor className={cn("size-4")} color="currentColor" />
            )}
            {themeInList === "dark" && (
              <Moon className={cn("size-4")} color="currentColor" />
            )}
            {themeInList === "light" && (
              <Sun1 className={cn("size-4")} color="currentColor" />
            )}
          </button>
        );
      })}
    </div>
  );
};
