"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/design-tokens";

const badgeVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white dark:bg-accent-dark dark:text-white",
        success:
          "bg-green-500 text-white dark:bg-green-600 dark:text-white",
        warning:
          "bg-yellow-500 text-white dark:bg-yellow-600 dark:text-white",
        error:
          "bg-red-500 text-white dark:bg-red-600 dark:text-white",
        neutral:
          "bg-surface-secondary text-text-primary border border-border dark:bg-surface-dark-secondary dark:text-text-primary-dark dark:border-border-dark",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
