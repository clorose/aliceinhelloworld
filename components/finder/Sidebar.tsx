"use client";

import React from "react";
import { Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import { BlogPost } from "@/lib/posts";
import { motion, AnimatePresence } from "framer-motion";

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
}

export function Sidebar({ posts, currentPath, onNavigate, selectedPath, rootPath = [] }: SidebarProps) {
  // Build tree from posts
  const tree: Record<string, TreeNode> = {};

  posts.forEach((post) => {
    let currentLevel = tree;
    let currentPathAccum: string[] = [];

    // Filter posts: Only include if they start with rootPath
    if (rootPath.length > 0) {
      const postPathStr = post.path.join('/');
      const rootPathStr = rootPath.join('/');
      if (!postPathStr.startsWith(rootPathStr)) return;
    }

    post.path.forEach((part, index) => {
      currentPathAccum = [...currentPathAccum, part];

      if (!currentLevel[part]) {
        currentLevel[part] = {
          name: part,
          path: [...currentPathAccum],
          children: {},
        };
      }

      // If we are deeper, move reference
      if (index < post.path.length) {
        currentLevel = currentLevel[part].children!;
      }
    });
  });

  // Calculate the starting node for rendering
  // If rootPath is ['ai'], we want to render the children of 'ai', not 'ai' itself.
  // Unless we want 'AI' header? User says: "Sidebar labels should be flat at this level (e.g., show 'LLM', 'IMG')"
  let displayRoot = tree;
  if (rootPath.length > 0) {
    // Traverse down to root
    for (const part of rootPath) {
      if (displayRoot[part] && displayRoot[part].children) {
        displayRoot = displayRoot[part].children!;
      } else {
        displayRoot = {}; // Path not found or empty
        break;
      }
    }
  }

  const renderTree = (nodes: Record<string, TreeNode>, level = 0) => {
    return Object.values(nodes).map((node) => {
      const isSelected = selectedPath.join('/') === node.path.join('/');

      return (
        <div key={node.path.join('/')} className="select-none">
          <button
            onClick={() => onNavigate(node.path)}
            className={`flex items-center gap-2 w-full px-2 py-1 text-sm rounded-md transition-colors ${isSelected
                ? "bg-blue-500 text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {isSelected ? (
              <FolderOpen className="w-4 h-4 fill-blue-200 text-blue-100" />
            ) : (
              <Folder className="w-4 h-4 fill-blue-400 text-blue-500" />
            )}
            <span className="capitalize truncate uppercase font-semibold text-xs tracking-wide">{node.name}</span>
          </button>

          {node.children && Object.keys(node.children).length > 0 && (
            <div className="ml-0">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-48 md:w-56 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="p-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Folders
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">

        {/* Virtual Root 'All Posts' */}
        <button
          onClick={() => onNavigate(rootPath)} // Go to root of this app
          className={`flex items-center gap-2 w-full px-2 py-1 text-sm rounded-md transition-colors ${selectedPath.join('/') === rootPath.join('/')
              ? "bg-blue-500 text-white"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
        >
          <Folder className="w-4 h-4 text-purple-500" />
          <span>All Posts</span>
        </button>

        {renderTree(displayRoot)}
      </div>
    </div>
  );
}
