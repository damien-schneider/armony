import { type VariantProps, cva } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer tracking-tight",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        "ghost-destructive":
          "text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        "ghost-active": "bg-accent text-accent-foreground",
        "ghost-2": "hover:bg-accent-2 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        xs: "h-7 rounded-md px-3 has-[>svg]:px-2",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        "icon-lg": "size-10",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-7",
      },
      // Add a new variant property for growing text effect
      growingText: {
        true: "group", // Apply group class when growingText is true
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      growingText: false,
    },
  },
);

// Define an interface for the Button component props
interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  growingTextContent?: string; // Add prop for the growing text content
}

function Button({
  className,
  variant,
  size,
  growingText,
  growingTextContent,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  // If growingText is true, we need to wrap the children
  if (growingText && growingTextContent) {
    return (
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, growingText, className }),
        )}
        {...props}
      >
        {/* Regular content */}
        {children}

        {/* Growing text content */}
        <span className="w-fit max-w-0 transform-gpu overflow-hidden transition-all duration-500 group-hover:max-w-32">
          <span className="transform-gpu whitespace-nowrap opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {growingTextContent}
          </span>
        </span>
      </Comp>
    );
  }

  // Regular button rendering
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, growingText, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonProps };
