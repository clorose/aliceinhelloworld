"use client";

import React, { forwardRef } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { DockApp } from "@/lib/app-registry";
import { DesktopWindow } from "@/lib/stores/desktop-store";
import { dock } from "@/lib/design-tokens";
import { calculateMagnification } from "@/lib/utils/magnification";

interface DockIconProps {
  app?: DockApp;
  window?: DesktopWindow;
  isMinimized?: boolean;
  isRunning?: boolean;
  mouseX: MotionValue<number | null>; // Mouse X position as MotionValue
  iconCenterX?: number; // Pre-calculated icon center X position
  onClick?: () => void;
  onMount?: (element: HTMLButtonElement) => void;
  onUnmount?: () => void;
}

export const DockIcon = forwardRef<HTMLButtonElement, DockIconProps>(
  function DockIcon(
    {
      app,
      window: win,
      isMinimized = false,
      isRunning = false,
      mouseX,
      iconCenterX,
      onClick,
      onMount,
      onUnmount,
    },
    externalRef
  ) {
  const icon = app?.icon || win?.icon;
  const title = app?.title || win?.title || "Unknown";

  // Calculate scale using useTransform (no re-render, pure animation)
  const scale = useTransform(mouseX, (currentMouseX) => {
    if (currentMouseX === null || iconCenterX === undefined) return 1;
    return calculateMagnification(currentMouseX, iconCenterX);
  });

  // Calculate y offset based on scale
  const y = useTransform(scale, (s) => -(s - 1) * 24);

  // Internal ref callback
  const handleRef = React.useCallback((element: HTMLButtonElement | null) => {
    // Forward to external ref if provided
    if (typeof externalRef === 'function') {
      externalRef(element);
    } else if (externalRef) {
      externalRef.current = element;
    }

    // Call onMount/onUnmount callbacks
    if (element && onMount) {
      onMount(element);
    } else if (!element && onUnmount) {
      onUnmount();
    }
  }, [externalRef, onMount, onUnmount]);

    return (
      <motion.button
        ref={handleRef}
        onClick={onClick}
        style={{
          scale,
          y,
        }}
        transition={{
          type: "spring",
          stiffness: dock.transition.spring.stiffness,
          damping: dock.transition.spring.damping,
        }}
        className="relative flex flex-col items-center group outline-none cursor-pointer"
        aria-label={`${title}${isRunning ? " (running)" : ""}${isMinimized ? " (minimized)" : ""}`}
        title={title}
      >
      {/* Icon Container */}
      <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-zinc-800 flex items-center justify-center transition-shadow group-hover:shadow-xl">
        {icon}
      </div>

      {/* Running Indicator Dot */}
      {isRunning && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={`absolute -bottom-1 w-1 h-1 rounded-full shadow-lg ${
            isMinimized
              ? "bg-orange-400 dark:bg-orange-500"
              : "bg-white/80 dark:bg-zinc-400"
          }`}
        />
      )}

        {/* Tooltip (optional - shown on hover) */}
        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="px-2 py-1 bg-zinc-900/90 text-white text-xs rounded whitespace-nowrap">
            {title}
          </div>
        </div>
      </motion.button>
    );
  }
);
