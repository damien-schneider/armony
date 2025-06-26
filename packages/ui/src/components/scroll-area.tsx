"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import React from "react";

function ScrollArea({
  className,
  children,

  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const hasViewportChild = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === ScrollAreaViewport,
  );
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      {hasViewportChild ? (
        children
      ) : (
        <ScrollAreaViewport>{children}</ScrollAreaViewport>
      )}
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

const ScrollAreaViewport = ({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaViewport>) => {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cn(
        "size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
  );
};

ScrollAreaViewport.displayName =
  ScrollAreaPrimitive.ScrollAreaViewport.displayName;

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "z-60 flex touch-none select-none p-px transition-colors",
        orientation === "vertical" &&
          "h-full w-2 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border/40"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar, ScrollAreaViewport };
