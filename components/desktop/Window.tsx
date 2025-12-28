"use client";

import React, { useState, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { DesktopWindow, useDesktopStore } from "@/lib/stores/desktop-store";
import { TrafficLightButton } from "@/components/ui";

interface WindowProps {
  window: DesktopWindow;
  constraintsRef?: React.RefObject<HTMLDivElement | null>;
}

function WindowComponent({ window, constraintsRef }: WindowProps) {
  const {
    closeWindow,
    bringToFront,
    minimizeWindow,
    toggleMaximize,
    updateWindowSize,
    updateWindowPosition,
  } = useDesktopStore();
  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    width: number;
    height: number;
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    resizeStartRef.current = {
      width: window.size?.width || 800,
      height: window.size?.height || 600,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
    setIsResizing(true);

    const handleResizeMove = (e: PointerEvent) => {
      if (!resizeStartRef.current) {
        return;
      }

      const deltaX = e.clientX - resizeStartRef.current.mouseX;
      const deltaY = e.clientY - resizeStartRef.current.mouseY;

      const newWidth = Math.max(400, resizeStartRef.current.width + deltaX);
      const newHeight = Math.max(300, resizeStartRef.current.height + deltaY);

      updateWindowSize(window.id, { width: newWidth, height: newHeight });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      globalThis.window.removeEventListener("pointermove", handleResizeMove);
      globalThis.window.removeEventListener("pointerup", handleResizeEnd);
    };

    globalThis.window.addEventListener("pointermove", handleResizeMove);
    globalThis.window.addEventListener("pointerup", handleResizeEnd);
  };

  return (
    <motion.div
      initial={{
        scale: 0.9,
        opacity: 0,
        x: window.position?.x || 100,
        y: window.position?.y || 100,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        x: window.position?.x || 100,
        y: window.position?.y || 100,
      }}
      exit={{
        scale: 0.9,
        opacity: 0,
        x: window.position?.x || 100,
        y: window.position?.y || 100,
      }}
      transition={{ duration: 0.2 }}
      className="absolute bg-white dark:bg-zinc-900 rounded-lg shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 flex flex-col"
      style={{
        zIndex: window.zIndex,
        width: window.size?.width || 800,
        height: window.size?.height || 600,
      }}
      drag={!window.isMaximized && !isResizing}
      dragControls={dragControls}
      dragConstraints={constraintsRef}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onMouseDown={() => bringToFront(window.id)}
      onDragEnd={(_, info) => {
        if (!window.isMaximized && constraintsRef?.current) {
          const currentX = window.position?.x || 100;
          const currentY = window.position?.y || 100;

          const newX = currentX + info.offset.x;
          const newY = currentY + info.offset.y;

          // Clamp to desktop bounds
          const desktopWidth = constraintsRef.current.clientWidth;
          const desktopHeight = constraintsRef.current.clientHeight;
          const windowWidth = window.size?.width || 800;
          const windowHeight = window.size?.height || 600;

          const clampedX = Math.max(0, Math.min(newX, desktopWidth - windowWidth));
          const clampedY = Math.max(32, Math.min(newY, desktopHeight - windowHeight)); // 32px for MenuBar

          updateWindowPosition(window.id, {
            x: clampedX,
            y: clampedY,
          });
        }
      }}
      role="dialog"
      aria-label={window.title}
      aria-modal="false"
    >
      {/* Title Bar */}
      <div
        className="h-9 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center px-4 justify-between cursor-move select-none group"
        onPointerDown={(e) => {
          bringToFront(window.id);
          dragControls.start(e);
        }}
      >
        <div className="flex items-center gap-2">
          <TrafficLightButton
            variant="close"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(window.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            title="Close"
            aria-label={`Close ${window.title}`}
          />

          <TrafficLightButton
            variant="minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(window.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            title="Minimize"
            aria-label={`Minimize ${window.title}`}
          />

          <TrafficLightButton
            variant="maximize"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize(window.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            title={window.isMaximized ? "Restore" : "Maximize"}
            aria-label={
              window.isMaximized
                ? `Restore ${window.title}`
                : `Maximize ${window.title}`
            }
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          {window.icon}
          <span>{window.title}</span>
        </div>
        <div className="w-14" /> {/* Spacer for balance */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
        {window.content}
      </div>

      {/* Resize Handle - Bottom Right Corner */}
      {!window.isMaximized && (
        <div
          onPointerDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50"
          style={{ touchAction: "none" }}
        >
          <svg
            className="w-4 h-4 text-zinc-400 dark:text-zinc-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

// Memoize Window component to prevent re-renders when other windows change
export const Window = React.memo(WindowComponent);
