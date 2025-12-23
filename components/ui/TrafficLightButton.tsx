"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/design-tokens"
import { X } from "lucide-react"

const trafficLightVariants = cva(
  // Base styles
  "w-3 h-3 rounded-full flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        close: "bg-red-500 hover:bg-red-600",
        minimize: "bg-yellow-500 hover:bg-yellow-600",
        maximize: "bg-green-500 hover:bg-green-600",
      },
    },
    defaultVariants: {
      variant: "close",
    },
  }
)

export interface TrafficLightButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof trafficLightVariants> {
  showIcon?: boolean
}

const TrafficLightButton = React.forwardRef<HTMLButtonElement, TrafficLightButtonProps>(
  ({ className, variant, showIcon = true, children, ...props }, ref) => {
    // Icon rendering based on variant
    const renderIcon = () => {
      if (!showIcon) return null
      
      switch (variant) {
        case "close":
          return <X className="w-2 h-2 opacity-0 group-hover/traffic:opacity-100 text-red-900/60" />
        case "minimize":
          return <div className="w-2 h-0.5 bg-yellow-900/60 opacity-0 group-hover/traffic:opacity-100" />
        case "maximize":
          return <div className="w-1.5 h-1.5 border border-green-900/60 opacity-0 group-hover/traffic:opacity-100" />
        default:
          return null
      }
    }

    return (
      <button
        className={cn(trafficLightVariants({ variant, className }), "group/traffic")}
        ref={ref}
        {...props}
      >
        {renderIcon()}
        {children}
      </button>
    )
  }
)

TrafficLightButton.displayName = "TrafficLightButton"

export { TrafficLightButton, trafficLightVariants }
