import { cn } from "@workspace/ui/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import {
  ArrowBigUpDashIcon,
  CommandIcon,
  CornerDownLeftIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const shortcutVariants = cva("inline-flex items-center tracking-widest", {
  variants: {
    variant: {
      default: "text-muted-foreground bg-muted",
      secondary: "text-secondary-foreground bg-background-2",
      outline: "bg-transparent border border-muted-foreground",
      accent: "text-accent-foreground",
      destructive: "text-destructive",
      primary: "text-primary",
    },
    size: {
      default: "px-1.5 py-1 text-xs rounded-sm",
      sm: "text-[10px]",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export function Shortcut({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof shortcutVariants>) {
  return (
    <span
      className={cn(shortcutVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function ShortcutItem({
  children,
}: { children: "enter" | "maj" | "cmd" | string }) {
  const icons: Record<string, ReactNode> = {
    cmd: <CommandIcon className="size-3" />,
    maj: <ArrowBigUpDashIcon className="size-3" />,
    enter: <CornerDownLeftIcon className="size-3" />,
  };

  return (
    <span className="inline-flex items-center justify-center">
      {icons[children] ?? children}
    </span>
  );
}

export { shortcutVariants };
