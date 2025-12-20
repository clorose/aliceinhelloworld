"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/lib/posts";
import { Sidebar } from "./Sidebar";
import { PostList } from "./PostList";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FinderAppProps {
  posts: BlogPost[];
  initialPath?: string[]; // e.g. ['ai']
  rootPath?: string[];
  onOpenPost: (post: BlogPost) => void;
}

export function FinderApp({ posts, initialPath = [], rootPath = [], onOpenPost }: FinderAppProps) {
  // State
  const [currentPath, setCurrentPath] = useState<string[]>(initialPath);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Derived State
  const filteredPosts = useMemo(() => {
    let result = posts;

    // 0. Base Filter by Root Path
    if (rootPath.length > 0) {
      const rootPathStr = rootPath.join('/');
      result = result.filter(p => p.path.join('/').startsWith(rootPathStr));
    }

    // 1. Filter by Path (if not in Tag mode or Root)
    // If in root (empty path), show all? Spec says "Scan subfolders... When a folder is clicked, show that folder's post list"
    // So if I am in 'ai', I show posts inside 'ai' (and maybe 'ai/sub'?). Finder usually shows items in immediate folder.
    // recursing? Let's assume inclusive of subfolders for this blog UX? 
    // "Mirrors the on-disk structure". 
    // Let's do exact match or recursive? Flattened usually feels better for blog. 
    // Let's do: If path is empty, show all. If path is set, show posts that start with that path.
    if (!tagFilter) {
      if (currentPath.length > 0) {
        const pathStr = currentPath.join('/');
        result = result.filter(p => p.path.join('/').startsWith(pathStr));
      }
    } else {
      // Tag Mode: Ignore path, show all with tag? Or refine current path?
      // Spec: "navigate to a post list filtered by that tag". Usually implies global filter.
      result = result.filter(p => p.frontmatter.tags?.includes(tagFilter));
    }

    return result;
  }, [posts, currentPath, tagFilter, rootPath]);

  // Handlers
  const handleNavigate = (path: string[]) => {
    setCurrentPath(path);
    setTagFilter(null); // Clear tag filter when navigating folders
    setSelectedPostId(null);
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPostId(post.id);
  };

  const handleOpenPost = (post: BlogPost) => {
    // Calling the parent Desktop openWindow handler
    onOpenPost(post);
  };

  const handleTagClick = (tag: string) => {
    setTagFilter(tag);
    setSelectedPostId(null); // Clear selection in new list
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* Toolbar */}
      <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-4 bg-zinc-50 dark:bg-zinc-900 select-none">
        <div className="flex items-center gap-1">
          {/* Navigation buttons placeholder */}
          <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-400" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 text-zinc-400" disabled>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
          <span className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200" onClick={() => handleNavigate(rootPath)}>Home</span>
          {currentPath.map((part, i) => (
            <React.Fragment key={i}>
              {/* Only show breadcrumbs if they are deeper than root */}
              {(i >= rootPath.length) && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                  <span
                    className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 capitalize"
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
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded text-xs">
                #{tagFilter}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden in Reader mode on small screens? Or always visible? Finder keeps sidebar. */}
        {/* For Reader Mode, user might want more space. Let's keep sidebar unless mobile. */}
        <div className="hidden md:flex h-full">
          <Sidebar
            posts={posts}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            selectedPath={currentPath}
            rootPath={rootPath}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950">
          <PostList
            posts={filteredPosts}
            onSelect={handleSelectPost}
            onOpen={handleOpenPost}
            selectedPostId={selectedPostId}
          />
        </div>
      </div>
    </div>
  );
}
