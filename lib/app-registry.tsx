import React, { Suspense, lazy } from "react";
import { Bot, Dice5, Code2, Folder, Terminal, Settings, User, Calendar, Bookmark } from "lucide-react";
import { BlogPost } from "./posts";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Lazy load heavy components
const FinderApp = lazy(() => import("@/components/finder/FinderApp").then(m => ({ default: m.FinderApp })));
const TerminalApp = lazy(() => import("@/components/terminal/TerminalApp").then(m => ({ default: m.TerminalApp })));
const SettingsApp = lazy(() => import("@/components/settings/SettingsApp").then(m => ({ default: m.SettingsApp })));
const ResumeApp = lazy(() => import("@/components/resume/ResumeApp").then(m => ({ default: m.ResumeApp })));
const CalendarApp = lazy(() => import("@/components/calendar/CalendarApp").then(m => ({ default: m.CalendarApp })));
const BookmarksApp = lazy(() => import("@/components/bookmarks/BookmarksApp").then(m => ({ default: m.BookmarksApp })));

// Loading fallback for lazy loaded components
function AppLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export interface DockApp {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isPinned: boolean;
  category?: string;
}

export type AppId = "finder" | "ai-blog" | "trpg-blog" | "dev-blog" | "terminal" | "settings" | "resume" | "calendar" | "bookmarks";

/**
 * App Registry Factory
 * Creates app definitions with dynamic content based on posts
 * Components are lazy loaded for better initial bundle size
 */
export function createAppRegistry(
  posts: BlogPost[],
  onOpenPost: (post: BlogPost) => void
): Record<AppId, DockApp> {
  return {
    finder: {
      id: "finder",
      title: "Finder",
      icon: <Folder className="w-8 h-8 text-blue-500" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <FinderApp
            posts={posts}
            initialPath={[]}
            rootPath={[]}
            onOpenPost={onOpenPost}
          />
        </Suspense>
      ),
      isPinned: true,
      category: "system",
    },
    "ai-blog": {
      id: "ai-blog",
      title: "AI Research",
      icon: <Bot className="w-8 h-8 text-purple-600" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <FinderApp
            posts={posts}
            initialPath={["ai"]}
            rootPath={["ai"]}
            onOpenPost={onOpenPost}
          />
        </Suspense>
      ),
      isPinned: true,
      category: "blog",
    },
    "trpg-blog": {
      id: "trpg-blog",
      title: "TRPG Scenarios",
      icon: <Dice5 className="w-8 h-8 text-red-600" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <FinderApp
            posts={posts}
            initialPath={["trpg"]}
            rootPath={["trpg"]}
            onOpenPost={onOpenPost}
          />
        </Suspense>
      ),
      isPinned: true,
      category: "blog",
    },
    "dev-blog": {
      id: "dev-blog",
      title: "Dev Log",
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <FinderApp
            posts={posts}
            initialPath={["dev"]}
            rootPath={["dev"]}
            onOpenPost={onOpenPost}
          />
        </Suspense>
      ),
      isPinned: true,
      category: "blog",
    },
    terminal: {
      id: "terminal",
      title: "Terminal",
      icon: <Terminal className="w-8 h-8 text-green-500" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <TerminalApp posts={posts} />
        </Suspense>
      ),
      isPinned: true,
      category: "system",
    },
    settings: {
      id: "settings",
      title: "Settings",
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <SettingsApp />
        </Suspense>
      ),
      isPinned: true,
      category: "system",
    },
    resume: {
      id: "resume",
      title: "About",
      icon: <User className="w-8 h-8 text-indigo-600" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <ResumeApp />
        </Suspense>
      ),
      isPinned: true,
      category: "info",
    },
    calendar: {
      id: "calendar",
      title: "Calendar",
      icon: <Calendar className="w-8 h-8 text-orange-600" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <CalendarApp posts={posts} onOpenPost={onOpenPost} />
        </Suspense>
      ),
      isPinned: true,
      category: "productivity",
    },
    bookmarks: {
      id: "bookmarks",
      title: "Bookmarks",
      icon: <Bookmark className="w-8 h-8 text-yellow-600" />,
      content: (
        <Suspense fallback={<AppLoading />}>
          <BookmarksApp posts={posts} onOpenPost={onOpenPost} />
        </Suspense>
      ),
      isPinned: true,
      category: "productivity",
    },
  };
}

/**
 * Default Dock app order
 * Finder is always first and cannot be reordered
 */
export const DEFAULT_DOCK_ORDER: AppId[] = [
  "finder",
  "ai-blog",
  "trpg-blog",
  "dev-blog",
  "calendar",
  "bookmarks",
  "resume",
  "settings",
];

