"use client";

import React, { useMemo, useCallback, useRef, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { DockIcon } from "./DockIcon";
import { useDesktopStore } from "@/lib/stores/desktop-store";
import { DockApp, AppId, DEFAULT_DOCK_ORDER } from "@/lib/app-registry";
import { getElementCenterX } from "@/lib/utils/magnification";

interface DockProps {
  appRegistry: Record<AppId, DockApp>;
}

export function Dock({ appRegistry }: DockProps) {
  const {
    windows,
    activeWindowId,
    openWindow,
    minimizeWindow,
    bringToFront,
    dockOpen,
  } = useDesktopStore();

  // Mouse tracking for magnification using MotionValue (no re-render)
  const mouseX = useMotionValue<number | null>(null);
  const iconRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [iconCenterPositions, setIconCenterPositions] = useState<Record<string, number>>({});

  // Get pinned apps in default order
  const pinnedApps = useMemo(() => {
    return DEFAULT_DOCK_ORDER
      .map((id) => appRegistry[id as AppId])
      .filter(Boolean);
  }, [appRegistry]);

  // Measure icon positions after mount/layout
  useLayoutEffect(() => {
    const positions: Record<string, number> = {};
    iconRefs.current.forEach((element, iconId) => {
      const centerX = getElementCenterX(element);
      positions[iconId] = centerX;
    });
    // Defer setState to avoid cascading renders warning
    queueMicrotask(() => {
      setIconCenterPositions(positions);
    });
  }, [pinnedApps]); // Re-measure when apps change

  // Click handler for dock icons
  const handleAppClick = (appId: string) => {
    const app = appRegistry[appId as AppId];
    if (!app) return;

    const existingWindow = windows.find((w) => w.id === appId);

    if (!existingWindow || !existingWindow.isOpen) {
      // Case 1: Window not open -> open it
      openWindow({
        id: appId,
        title: app.title,
        icon: app.icon,
        content: app.content,
      });
    } else if (existingWindow.isMinimized) {
      // Case 2: Window minimized -> restore it
      bringToFront(appId);
    } else if (activeWindowId === appId) {
      // Case 3: Window active -> minimize it
      minimizeWindow(appId);
    } else {
      // Case 4: Window inactive -> bring to front
      bringToFront(appId);
    }
  };

  // Check if an app is currently running
  const isAppRunning = (appId: string) => {
    return windows.some((w) => w.id === appId && w.isOpen);
  };

  // Check if an app is currently minimized
  const isAppMinimized = (appId: string) => {
    return windows.some((w) => w.id === appId && w.isOpen && w.isMinimized);
  };

  // Mouse move handler - update MotionValue directly (no re-render)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
  }, [mouseX]);

  // Mouse leave handler - reset to null
  const handleMouseLeave = useCallback(() => {
    mouseX.set(null);
  }, [mouseX]);

  // Pre-create stable callbacks for each icon using useMemo
  const iconCallbacks = useMemo(() => {
    const callbacks: Record<string, { onMount: (el: HTMLButtonElement) => void; onUnmount: () => void }> = {};
    DEFAULT_DOCK_ORDER.forEach((iconId) => {
      callbacks[iconId] = {
        onMount: (element: HTMLButtonElement) => {
          iconRefs.current.set(iconId, element);
        },
        onUnmount: () => {
          iconRefs.current.delete(iconId);
        },
      };
    });
    return callbacks;
  }, []);

  return (
    <AnimatePresence>
      {dockOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[200] pb-2"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="backdrop-blur-2xl bg-white/30 dark:bg-zinc-900/30 rounded-2xl border border-white/20 dark:border-zinc-700/20 shadow-2xl px-3 py-2">
            <div className="flex items-end gap-3">
              {/* Pinned Apps */}
              {pinnedApps.map((app) => (
                <DockIcon
                  key={app.id}
                  app={app}
                  isRunning={isAppRunning(app.id)}
                  isMinimized={isAppMinimized(app.id)}
                  mouseX={mouseX}
                  iconCenterX={iconCenterPositions[app.id]}
                  onClick={() => handleAppClick(app.id)}
                  onMount={iconCallbacks[app.id]?.onMount}
                  onUnmount={iconCallbacks[app.id]?.onUnmount}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
