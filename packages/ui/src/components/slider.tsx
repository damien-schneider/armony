"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";

const sliderVariants = {
  default: {
    track:
      "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
    range:
      "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
    thumb:
      "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
  },
  soft: {
    track:
      "bg-primary/5 relative grow overflow-hidden rounded-full backdrop-blur-sm data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2",
    range:
      "bg-gradient-to-r from-primary/30 to-primary/30 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
    thumb:
      "border-primary/20 bg-background ring-primary/10 block w-1 h-5 shrink-0 rounded-full border-2 shadow-md transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-110 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
  },
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  variant = "default",
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  variant?: keyof typeof sliderVariants;
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  const variantStyles = sliderVariants[variant];

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(variantStyles.track)}
        data-slot="slider-track"
      >
        <SliderPrimitive.Range
          className={cn(variantStyles.range)}
          data-slot="slider-range"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          className={cn(variantStyles.thumb)}
          data-slot="slider-thumb"
          // biome-ignore lint/suspicious/noArrayIndexKey: <>
          key={`thumb-${index}`}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
