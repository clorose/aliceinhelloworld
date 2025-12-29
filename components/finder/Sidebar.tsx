"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import { BlogPost } from "@/lib/posts";

// Sidebar.tsx
interface SidebarProps {
  posts: BlogPost[];
  currentPath: string[]; // e.g. ['ai', 'img']
  onNavigate: (path: string[]) => void;
  selectedPath: string[];
  rootPath?: string[]; // e.g. ['ai']
}

interface TreeNode {
  name: string;
  path: string[];
  children?: Record<string, TreeNode>;
  postCount?: number; // Total posts in this folder (recursive)
}

export function Sidebar({
  posts,
  currentPath: _currentPath,
  onNavigate,
  selectedPath,
  rootPath = [],
}: SidebarProps) {
  // Track expanded folders
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    // Auto-expand current path
    const expanded = new Set<string>();
    selectedPath.forEach((_, i) => {
      expanded.add(selectedPath.slice(0, i + 1).join("/"));
    });
    return expanded;
  });

  const toggleFolder = useCallback((pathKey: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(pathKey)) {
        next.delete(pathKey);
      } else {
        next.add(pathKey);
      }
      return next;
    });
  }, []);

  // Auto-expand folders when selectedPath changes
  React.useEffect(() => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      selectedPath.forEach((_, i) => {
        next.add(selectedPath.slice(0, i + 1).join("/"));
      });
      return next;
    });
  }, [selectedPath]);

  // Memoize tree building to prevent rebuilding on every render
  const displayRoot = useMemo(() => {
    // Build tree from posts
    const tree: Record<string, TreeNode> = {};

    posts.forEach((post) => {
      let currentLevel = tree;
      let currentPathAccum: string[] = [];

      // Filter posts: Only include if they start with rootPath
      if (rootPath.length > 0) {
        const postPathStr = post.path.join("/");
        const rootPathStr = rootPath.join("/");
        if (!postPathStr.startsWith(rootPathStr)) return;
      }

      post.path.forEach((part, index) => {
        currentPathAccum = [...currentPathAccum, part];

        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            path: [...currentPathAccum],
            children: {},
            postCount: 0,
          };
        }

        // If we are deeper, move reference
        if (index < post.path.length) {
          currentLevel = currentLevel[part].children!;
        }
      });
    });

    // Calculate post counts recursively
    const calculatePostCount = (node: TreeNode): number => {
      // Recursively process children first
      if (node.children) {
        Object.values(node.children).forEach((child) => {
          calculatePostCount(child);
        });
      }

      // Count posts at this level (posts with exact path match)
      const nodePath = node.path.join("/");
      const postsAtThisLevel = posts.filter((p) => {
        const postPath = p.path.join("/");
        return postPath.startsWith(nodePath);
      }).length;

      node.postCount = postsAtThisLevel;
      return postsAtThisLevel;
    };

    Object.values(tree).forEach((node) => calculatePostCount(node));

    // Calculate the starting node for rendering
    // If rootPath is ['ai'], we want to render the children of 'ai', not 'ai' itself.
    let result = tree;
    if (rootPath.length > 0) {
      // Traverse down to root
      for (const part of rootPath) {
        if (result[part] && result[part].children) {
          result = result[part].children!;
        } else {
          result = {}; // Path not found or empty
          break;
        }
      }
    }

    return result;
  }, [posts, rootPath]);

  const renderTree = (nodes: Record<string, TreeNode>, level = 0) => {
    return Object.values(nodes).map((node) => {
      const isSelected = selectedPath.join("/") === node.path.join("/");
      const pathKey = node.path.join("/");
      const isExpanded = expandedFolders.has(pathKey);
      const hasChildren = node.children && Object.keys(node.children).length > 0;

      return (
        <div key={pathKey} className="select-none">
          <div className="flex items-center gap-1">
            {/* Chevron toggle button */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(pathKey);
                }}
                className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors flex-shrink-0"
                aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-zinc-400" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}

            {/* Folder button */}
            <button
              onClick={() => onNavigate(node.path)}
              className={`flex items-center gap-2 flex-1 px-2 py-1 text-sm rounded-md transition-colors ${
                isSelected
                  ? "bg-blue-500 text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
              aria-label={`Navigate to ${node.name} folder`}
              aria-current={isSelected ? "page" : undefined}
            >
              {isSelected ? (
                <FolderOpen className="w-4 h-4 fill-blue-200 text-blue-100" />
              ) : (
                <Folder className="w-4 h-4 fill-blue-400 text-blue-500" />
              )}
              <span className="uppercase truncate font-semibold text-xs tracking-wide">
                {node.name}
              </span>
              {node.postCount !== undefined && node.postCount > 0 && (
                <span className={`ml-auto text-[10px] ${
                  isSelected ? "text-blue-100" : "text-zinc-400"
                }`}>
                  ({node.postCount})
                </span>
              )}
            </button>
          </div>

          {/* Children */}
          {hasChildren && isExpanded && (
            <div className="ml-0">{renderTree(node.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <nav
      className="w-48 md:w-56 h-full bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col"
      aria-label="Blog folder navigation"
    >
      <div className="p-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex-shrink-0">
        Folders
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 min-h-0">
        {/* Virtual Root 'All Posts' */}
        <button
          onClick={() => onNavigate(rootPath)} // Go to root of this app
          className={`flex items-center gap-2 w-full px-2 py-1 text-sm rounded-md transition-colors ${
            selectedPath.join("/") === rootPath.join("/")
              ? "bg-blue-500 text-white"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
          aria-label="View all posts"
          aria-current={
            selectedPath.join("/") === rootPath.join("/") ? "page" : undefined
          }
        >
          <Folder className="w-4 h-4 text-purple-500" />
          <span>All Posts</span>
        </button>

        {renderTree(displayRoot)}
      </div>
    </nav>
  );
}
