"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Progress as ProgressPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

function Progress({
  className,
  indicatorClassName,
  value,
  ...props
}: {
  indicatorClassName?: string;
} & ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
