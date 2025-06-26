import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ArrowBigUpDashIcon,
  CommandIcon,
  CornerDownLeftIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

const shortcutVariants = cva("inline-flex items-center tracking-widest", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      secondary: "bg-background-2 text-secondary-foreground",
      outline: "border border-muted-foreground bg-transparent",
      accent: "text-accent-foreground",
      destructive: "text-destructive",
      primary: "text-primary",
    },
    size: {
      default: "rounded-sm px-1.5 py-1 text-xs",
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
}: {
  children: "enter" | "maj" | "cmd" | string;
}) {
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
