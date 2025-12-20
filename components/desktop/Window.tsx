"use client";

import React, { useState, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { DesktopWindow, useDesktopStore } from "@/lib/stores/desktop-store";

interface WindowProps {
  window: DesktopWindow;
}

export function Window({ window }: WindowProps) {
  const { closeWindow, bringToFront, minimizeWindow, toggleMaximize, updateWindowSize, updateWindowPosition } = useDesktopStore();
  const dragControls = useDragControls();
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ width: number; height: number; mouseX: number; mouseY: number } | null>(null);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      width: window.size?.width || 800,
      height: window.size?.height || 600,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
  };

  React.useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.mouseX;
      const deltaY = e.clientY - resizeStartRef.current.mouseY;

      const newWidth = Math.max(400, resizeStartRef.current.width + deltaX);
      const newHeight = Math.max(300, resizeStartRef.current.height + deltaY);

      updateWindowSize(window.id, { width: newWidth, height: newHeight });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
    };

    globalThis.window.addEventListener('mousemove', handleResizeMove);
    globalThis.window.addEventListener('mouseup', handleResizeEnd);

    return () => {
      globalThis.window.removeEventListener('mousemove', handleResizeMove);
      globalThis.window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, window.id, updateWindowSize]);

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
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute bg-white dark:bg-zinc-900 rounded-lg shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 flex flex-col"
      style={{
        zIndex: window.zIndex,
        width: window.size?.width || 800,
        height: window.size?.height || 600,
      }}
      drag={!window.isMaximized && !isResizing}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onMouseDown={() => bringToFront(window.id)}
      onDragEnd={(_, info) => {
        if (!window.isMaximized) {
          const currentX = window.position?.x || 100;
          const currentY = window.position?.y || 100;
          updateWindowPosition(window.id, {
            x: currentX + info.offset.x,
            y: currentY + info.offset.y,
          });
        }
      }}
    >
      {/* Title Bar */}
      <div
        className="h-9 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center px-4 justify-between cursor-default select-none group"
        onPointerDown={(e) => {
          bringToFront(window.id);
          dragControls.start(e);
        }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(window.id);
            }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-transparent hover:text-white/80 transition-colors group/close"
            title="Close"
          >
            <X className="w-2 h-2 opacity-0 group-hover/close:opacity-100" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(window.id);
            }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-colors group/minimize"
            title="Minimize"
          >
            <div className="w-2 h-0.5 bg-yellow-900/60 opacity-0 group-hover/minimize:opacity-100" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize(window.id);
            }}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors group/maximize"
            title={window.isMaximized ? "Restore" : "Maximize"}
          >
            <div className="w-1.5 h-1.5 border border-green-900/60 opacity-0 group-hover/maximize:opacity-100" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          {window.icon}
          <span>{window.title}</span>
        </div>

        <div className="w-14" /> {/* Spacer for balance */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-zinc-950 p-4 relative">
        {window.content}

        {/* Resize Handle - Bottom Right Corner */}
        {!window.isMaximized && (
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group/resize"
            style={{ touchAction: 'none' }}
          >
            <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-zinc-400 dark:border-zinc-600 group-hover/resize:border-blue-500 transition-colors" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
