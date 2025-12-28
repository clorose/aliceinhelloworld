"use client";

import React, { useRef, useCallback, useMemo, useState, Suspense, lazy } from "react";
import { MenuBar } from "./MenuBar";
import { AppIcon } from "./AppIcon";
import { Window } from "./Window";
import { MissionControl } from "./MissionControl";
import { Dock } from "./Dock";
import { QuickSearch } from "@/components/quick-search/QuickSearch";
import { useDesktopStore } from "@/lib/stores/desktop-store";
import { Bot, Terminal, Globe } from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { PostReader } from "@/components/finder/PostReader";
import type { BlogPost } from "@/lib/posts";
import { createAppRegistry, DEFAULT_DOCK_ORDER, type AppId } from "@/lib/app-registry";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useHashNavigation } from "@/hooks/useHashNavigation";

// Lazy load TerminalApp for handleTerminalClick
const TerminalApp = lazy(() => import("@/components/terminal/TerminalApp").then(m => ({ default: m.TerminalApp })));

function AppLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <LoadingSpinner size="lg" />
    </div>
  );
}

interface DesktopProps {
  posts: BlogPost[];
}

export function Desktop({ posts }: DesktopProps) {
  const {
    windows,
    openWindow,
    toggleMissionControl,
    missionControlOpen,
    showDesktop,
    activeWindowId,
    minimizeWindow,
    bringToFront,
  } = useDesktopStore();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  // Global Key Listener for Mission Control (Ctrl + `) and Quick Search (Cmd/Ctrl + K)
  useGlobalShortcuts({
    onQuickSearch: () => setQuickSearchOpen(true),
    onMissionControl: toggleMissionControl,
  });

  // Memoize openReader to prevent recreation on every render
  // Note: React Compiler can't preserve memoization due to recursive reference pattern
  /* eslint-disable react-hooks/preserve-manual-memoization */
  const openReader = useCallback(
    (post: BlogPost) => {
      openWindow({
        id: `post-${post.id}`,
        title: post.slug,
        icon: <Bot className="w-8 h-8 text-zinc-500" />,
        content: (
          <PostReader
            post={post}
            posts={posts}
            onTagClick={() => {}}
            onNavigatePost={(newPost) => {
              // Close current post window and open new one
              openWindow({
                id: `post-${newPost.id}`,
                title: newPost.slug,
                icon: <Bot className="w-8 h-8 text-zinc-500" />,
                content: (
                  <PostReader
                    post={newPost}
                    posts={posts}
                    onTagClick={() => {}}
                    onNavigatePost={openReader}
                  />
                ),
              });
            }}
          />
        ),
      });
    },
    [openWindow, posts]
  );
  /* eslint-enable react-hooks/preserve-manual-memoization */

  // Handle URL hash for direct post links
  useHashNavigation({ posts, onOpenPost: openReader });

  const handleTerminalClick = useCallback(() => {
    const terminalWindow = windows.find((w) => w.id === "terminal");

    if (!terminalWindow || !terminalWindow.isOpen) {
      // Case 1: Window not open -> open it
      openWindow({
        id: "terminal",
        title: "Terminal",
        icon: <Terminal className="w-8 h-8 text-green-500" />,
        content: (
          <Suspense fallback={<AppLoading />}>
            <TerminalApp posts={posts} />
          </Suspense>
        ),
      });
    } else if (terminalWindow.isMinimized) {
      // Case 2: Window minimized -> restore it
      bringToFront("terminal");
    } else if (activeWindowId === "terminal") {
      // Case 3: Window active -> minimize it
      minimizeWindow("terminal");
    } else {
      // Case 4: Window inactive -> bring to front
      bringToFront("terminal");
    }
  }, [windows, openWindow, posts, activeWindowId, minimizeWindow, bringToFront]);

  // Check if terminal is open and not minimized
  const isTerminalOpen = useMemo(() => {
    const terminalWindow = windows.find((w) => w.id === "terminal");
    return terminalWindow?.isOpen && !terminalWindow.isMinimized;
  }, [windows]);

  // Create app registry (for Dock)
  const appRegistry = useMemo(
    () => createAppRegistry(posts, openReader),
    [posts, openReader]
  );

  // Desktop icons - use appRegistry (already lazy loaded)
  // Exclude 'finder' and 'terminal' from desktop icons
  const desktopAppIds: AppId[] = useMemo(
    () => DEFAULT_DOCK_ORDER.filter((id) => id !== "finder" && id !== "terminal"),
    []
  );

  return (
    <div
      ref={desktopRef}
      className="h-dvh w-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative select-none"
      role="main"
      aria-label="Desktop workspace"
    >
      <MenuBar
        onTerminalClick={handleTerminalClick}
        onSearchClick={() => setQuickSearchOpen(true)}
        isTerminalOpen={isTerminalOpen}
      />

      {/* Desktop Icons Area - Grid Layout */}
      <div className="absolute top-12 left-4 right-auto bottom-auto grid grid-cols-2 gap-4 p-4 z-0">
        {/* Blog Link - Goes to main blog */}
        <Link href="/" className="block">
          <AppIcon
            title="Blog"
            icon={<Globe className="w-8 h-8 text-emerald-600" />}
            onClick={() => {}}
          />
        </Link>
        {desktopAppIds.map((appId) => {
          const app = appRegistry[appId];
          return (
            <AppIcon
              key={app.id}
              title={app.title}
              icon={app.icon}
              onClick={() =>
                openWindow({
                  id: app.id,
                  title: app.title,
                  icon: app.icon,
                  content: app.content,
                })
              }
            />
          );
        })}
      </div>

      {/* Windows Area */}
      {/* We conditional render windows based on showDesktop false.
          If showDesktop is true, we hide them (or animate away).
      */}
      <AnimatePresence>
        {!showDesktop &&
          !missionControlOpen &&
          windows.map(
            (window) =>
              window.isOpen &&
              !window.isMinimized && <Window key={window.id} window={window} constraintsRef={desktopRef} />
          )}
      </AnimatePresence>

      <MissionControl />
      <Dock appRegistry={appRegistry} />
      <QuickSearch
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        posts={posts}
        onOpenPost={openReader}
      />
    </div>
  );
}
