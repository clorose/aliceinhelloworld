"use client";

import React, { useEffect, useRef } from "react";
import { MenuBar } from "./MenuBar";
import { AppIcon } from "./AppIcon";
import { Window } from "./Window";
import { MissionControl } from "./MissionControl";
import { useDesktopStore } from "@/lib/stores/desktop-store";
import { Bot, Dice5, Code2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { FinderApp } from "@/components/finder/FinderApp";
import { PostReader } from "@/components/finder/PostReader";
import { Toast } from "@/components/ui/Toast";
import type { BlogPost } from "@/lib/posts";

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
    toast,
    hideToast
  } = useDesktopStore();
  const desktopRef = useRef<HTMLDivElement>(null);

  // Global Key Listener for Mission Control (Ctrl + `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + Backquote (regardless of layout generally Backquote is `)
      if (e.ctrlKey && e.code === "Backquote") {
        e.preventDefault();
        toggleMissionControl();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMissionControl]);


  // Define Apps
  // Helper to open a reader window
  const openReader = (post: BlogPost) => {
    openWindow({
      id: `post-${post.id}`,
      title: post.slug,
      icon: <Bot className="w-8 h-8 text-zinc-500" />, // Generic icon or specific
      content: <PostReader post={post} onTagClick={() => { }} /> // Tag click in reader? Maybe launch finder? For now noop or simple log.
    });
  }

  const apps = [
    {
      id: "ai-blog",
      title: "AI Research",
      icon: <Bot className="w-8 h-8 text-purple-600" />,
      content: <FinderApp posts={posts} initialPath={['ai']} rootPath={['ai']} onOpenPost={openReader} />,
    },
    {
      id: "trpg-blog",
      title: "TRPG Scenarios",
      icon: <Dice5 className="w-8 h-8 text-red-600" />,
      content: <FinderApp posts={posts} initialPath={['trpg']} rootPath={['trpg']} onOpenPost={openReader} />,
    },
    {
      id: "dev-blog",
      title: "Dev Log",
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      content: <FinderApp posts={posts} initialPath={['dev']} rootPath={['dev']} onOpenPost={openReader} />,
    },
  ];

  return (
    <div
      ref={desktopRef}
      className="h-dvh w-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative select-none"
    >

      <MenuBar />

      {/* Desktop Icons Area */}
      <div className="absolute top-12 left-4 bottom-0 flex flex-col flex-wrap gap-4 items-start content-start p-4 z-0">
        {apps.map((app) => (
          <AppIcon
            key={app.id}
            title={app.title}
            icon={app.icon}
            onClick={() => openWindow({
              id: app.id,
              title: app.title,
              icon: app.icon,
              content: app.content
            })}
          />
        ))}
      </div>

      {/* Windows Area */}
      {/* We conditional render windows based on showDesktop false.
          If showDesktop is true, we hide them (or animate away).
      */}
      <AnimatePresence>
        {!showDesktop && !missionControlOpen && windows.map((window) => (
          window.isOpen && !window.isMinimized && (
            <Window key={window.id} window={window} />
          )
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} />
        )}
      </AnimatePresence>

      <MissionControl />

    </div>
  );
}
