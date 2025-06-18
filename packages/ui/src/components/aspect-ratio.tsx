"use client";

import { AspectRatio as AspectRatioPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

function AspectRatio({
  ...props
}: ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
