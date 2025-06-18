"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Monitor, Moon, Sun1 } from "iconsax-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useIsClient } from "usehooks-ts";

export const ThemeSwitcher = ({
  className,
}: {
  className?: string;
}) => {
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
    <div
      ref={containerRef}
      className={cn(
        "relative group inline-flex items-center gap-1 p-0.5 rounded-full",
        className,
      )}
      onMouseLeave={() => setHoveredTheme(activeTheme ?? null)}
    >
      <div
        className="absolute bg-neutral-400/20 rounded-full transition-all duration-300 ease-out"
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
            type="button"
            key={themeInList}
            data-theme={themeInList}
            onClick={() => {
              setTheme(themeInList);
            }}
            onMouseEnter={() => setHoveredTheme(themeInList)}
            className={cn(
              "relative cursor-pointer size-6 inline-grid place-content-center transition-all duration-300 z-10",
              activeTheme === themeInList
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {themeInList === "system" && (
              <Monitor color="currentColor" className={cn("size-4")} />
            )}
            {themeInList === "dark" && (
              <Moon color="currentColor" className={cn("size-4")} />
            )}
            {themeInList === "light" && (
              <Sun1 color="currentColor" className={cn("size-4")} />
            )}
          </button>
        );
      })}
    </div>
  );
};
