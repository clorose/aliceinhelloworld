"use client";

import React from "react";
import { cn } from "@/lib/design-tokens";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

/**
 * macOS-style toggle switch component
 */
export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: ToggleSwitchProps) {
  const sizes = {
    sm: {
      track: "h-5 w-9",
      thumb: "h-3.5 w-3.5",
      translate: checked ? "translate-x-4" : "translate-x-0.5",
    },
    md: {
      track: "h-6 w-11",
      thumb: "h-4 w-4",
      translate: checked ? "translate-x-6" : "translate-x-1",
    },
  };

  const { track, thumb, translate } = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-accent-dark",
        track,
        checked
          ? "bg-accent dark:bg-accent-dark"
          : "bg-gray-300 dark:bg-gray-600",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span
        className={cn(
          "inline-block transform rounded-full bg-white shadow transition-transform",
          thumb,
          translate
        )}
      />
    </button>
  );
}
