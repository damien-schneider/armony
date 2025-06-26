import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import type { ComponentProps } from "react";

export const H1 = ({ className, children, ...props }: ComponentProps<"h1">) => {
  return (
    <h1
      className={cn(
        "text-3xl text-foreground tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export const H2 = ({ className, children, ...props }: ComponentProps<"h2">) => {
  return (
    <h2
      className={cn(
        "font-medium text-2xl text-foreground tracking-tight sm:text-3xl md:text-4xl",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export const H3 = ({ className, children, ...props }: ComponentProps<"h3">) => {
  return (
    <h3
      className={cn(
        "font-medium text-foreground text-xl tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const H4 = ({ className, children, ...props }: ComponentProps<"h4">) => {
  return (
    <h4
      className={cn(
        "font-medium text-foreground text-lg tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
};

export const H5 = ({ className, children, ...props }: ComponentProps<"h5">) => {
  return (
    <h5
      className={cn(
        "font-medium text-base text-foreground tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h5>
  );
};

const paragraphVariants = cva("", {
  variants: {
    variant: {
      default: "font-medium text-foreground/80 text-sm tracking-tight",
      "body-1": "font-medium text-foreground/80 text-sm tracking-tight",
      "body-xl": "font-light text-foreground/80 text-lg sm:text-xl",
      caption: "text-foreground/50 text-xs",
      "caption-lg": "text-foreground/50",
      error: "text-red-500 text-sm",
      success: "text-green-500 text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const P = ({
  className,
  children,
  variant,
  ...props
}: ComponentProps<"p"> & VariantProps<typeof paragraphVariants>) => {
  return (
    <p className={cn(paragraphVariants({ variant }), className)} {...props}>
      {children}
    </p>
  );
};
