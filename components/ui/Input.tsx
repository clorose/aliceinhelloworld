"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/design-tokens";

const inputVariants = cva(
  // Base styles
  "flex w-full font-mono transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-surface-secondary border border-border text-text-primary focus-visible:ring-accent dark:bg-surface-dark-secondary dark:border-border-dark dark:text-text-primary-dark dark:focus-visible:ring-accent-dark",
        error:
          "bg-surface-secondary border-2 border-red-500 text-text-primary focus-visible:ring-red-500 dark:bg-surface-dark-secondary dark:border-red-600 dark:text-text-primary-dark dark:focus-visible:ring-red-600",
        success:
          "bg-surface-secondary border-2 border-green-500 text-text-primary focus-visible:ring-green-500 dark:bg-surface-dark-secondary dark:border-green-600 dark:text-text-primary-dark dark:focus-visible:ring-green-600",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-button",
        lg: "h-12 px-6 text-base rounded-button",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
