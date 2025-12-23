"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/design-tokens"

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-accent text-white hover:bg-accent-hover dark:bg-accent-dark dark:hover:bg-accent-dark-hover",
        secondary: "bg-surface-secondary text-text-primary hover:bg-surface-tertiary dark:bg-surface-dark-secondary dark:text-text-primary-dark dark:hover:bg-surface-dark-tertiary",
        ghost: "hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary",
        outline: "border border-border bg-transparent hover:bg-surface-secondary dark:border-border-dark dark:hover:bg-surface-dark-secondary",
        destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        link: "text-accent underline-offset-4 hover:underline dark:text-accent-dark",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-button",
        lg: "h-12 px-6 text-base rounded-button",
        icon: "h-10 w-10 rounded-button",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
