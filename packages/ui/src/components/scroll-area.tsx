"use client";

import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "@workspace/ui/lib/utils";
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
        "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
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
        "flex touch-none p-px transition-colors select-none z-60",
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
        className="bg-border/40 relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar, ScrollAreaViewport };
