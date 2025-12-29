"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/lib/posts";
import { Sidebar } from "./Sidebar";
import { PostList } from "./PostList";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

interface FinderAppProps {
  posts: BlogPost[];
  initialPath?: string[]; // e.g. ['ai']
  rootPath?: string[];
  onOpenPost: (post: BlogPost) => void;
}

export function FinderApp({
  posts,
  initialPath = [],
  rootPath = [],
  onOpenPost,
}: FinderAppProps) {
  // State
  const [currentPath, setCurrentPath] = useState<string[]>(initialPath);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Persisted search state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derived State
  const filteredPosts = useMemo(() => {
    let result = posts;

    // 0. Base Filter by Root Path
    if (rootPath.length > 0) {
      const rootPathStr = rootPath.join("/");
      result = result.filter((p) => p.path.join("/").startsWith(rootPathStr));
    }

    // 1. Filter by Path (if not in Tag mode or Root)
    if (!tagFilter) {
      if (currentPath.length > 0) {
        const pathStr = currentPath.join("/");
        result = result.filter((p) => p.path.join("/").startsWith(pathStr));
      }
    } else {
      // Tag Mode: show all with tag
      result = result.filter((p) => p.frontmatter.tags?.includes(tagFilter));
    }

    return result;
  }, [posts, currentPath, tagFilter, rootPath]);

  // Convert to relative paths (remove rootPath from beginning)
  // IMPORTANT: Keep original post.id unchanged because PostReader uses it to find MDX content in POST_MAP
  const postsWithRelativePaths = useMemo(() => {
    if (rootPath.length === 0) return filteredPosts;

    return filteredPosts.map((post) => ({
      ...post,
      path: post.path.slice(rootPath.length), // Remove rootPath prefix for tree display
      // DO NOT change id - it's used by POST_MAP to find MDX content
    }));
  }, [filteredPosts, rootPath]);

  // Handlers
  const handleNavigate = (path: string[]) => {
    setCurrentPath(path);
    setTagFilter(null); // Clear tag filter when navigating folders
    setSelectedPostId(null);
    setIsSidebarOpen(false);
    // Keep search term persisted across navigation
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPostId(post.id);
  };

  const handleOpenPost = (post: BlogPost) => {
    // Calling the parent Desktop openWindow handler
    onOpenPost(post);
  };

  // Reserved for future use
  const _handleTagClick = (tag: string) => {
    setTagFilter(tag);
    setSelectedPostId(null); // Clear selection in new list
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Toolbar */}
      <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-4 bg-zinc-50 dark:bg-zinc-900 select-none">
        <div className="flex items-center gap-1">
          {/* Mobile Sidebar Toggle */}
          <button
            className="md:hidden p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Navigation buttons placeholder */}
          <button
            className="hidden md:block p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-400"
            disabled
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="hidden md:block p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-400"
            disabled
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2 overflow-hidden">
          <span
            className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 shrink-0"
            onClick={() => handleNavigate(rootPath)}
          >
            Home
          </span>
          {currentPath.map((part, i) => (
            <React.Fragment key={i}>
              {/* Only show breadcrumbs if they are deeper than root */}
              {i >= rootPath.length && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span
                    className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 capitalize truncate"
                    onClick={() => handleNavigate(currentPath.slice(0, i + 1))}
                  >
                    {part}
                  </span>
                </>
              )}
            </React.Fragment>
          ))}
          {tagFilter && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded text-xs shrink-0">
                #{tagFilter}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`absolute inset-y-0 left-0 z-20 bg-zinc-50 dark:bg-zinc-900 h-full border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          }`}
        >
          <Sidebar
            posts={posts}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            selectedPath={currentPath}
            rootPath={rootPath}
          />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-10 bg-black/20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Right Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 overflow-hidden">
          <PostList
            posts={postsWithRelativePaths}
            onSelect={handleSelectPost}
            onOpen={handleOpenPost}
            selectedPostId={selectedPostId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currentPath={currentPath}
            rootPath={rootPath}
          />
        </div>
      </div>
    </div>
  );
}
