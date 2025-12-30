"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/posts";
import { ChevronDown, ChevronRight, ChevronLeft, Folder, FolderOpen } from "lucide-react";

interface CategorySidebarProps {
  posts: BlogPost[];
  currentPath?: string[]; // Current post's category path (empty = root/main page)
  selectedCategory: string[] | null;
  onSelectCategory: (category: string[] | null) => void;
  onBack?: () => void;
  className?: string;
}

interface CategoryTree {
  name: string;
  path: string[];
  count: number;
  children: CategoryTree[];
}

// Memoized category item component
const CategoryItem = memo(({
  category,
  isSelected,
  isCurrentPath,
  isExpanded,
  hasChildren,
  onSelect,
  onToggle,
  depth = 0,
}: {
  category: CategoryTree;
  isSelected: boolean;
  isCurrentPath: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onSelect: () => void;
  onToggle: (pathKey: string) => void;
  depth?: number;
}) => {
  const pathKey = category.path.join("/");

  return (
    <div>
      <div
        className={`flex items-center rounded-lg transition-colors ${
          isSelected
            ? "bg-indigo-500 text-white"
            : isCurrentPath
            ? "bg-indigo-100 dark:bg-indigo-900/30"
            : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }`}
        style={{ paddingLeft: depth > 0 ? `${depth * 16}px` : undefined }}
      >
        {/* Expand/Collapse button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(pathKey);
            }}
            className={`p-1 rounded transition-colors ${
              isSelected ? "hover:bg-indigo-400" : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {isExpanded ? (
              <ChevronDown className={`w-3 h-3 ${isSelected ? "text-indigo-200" : "text-zinc-400"}`} />
            ) : (
              <ChevronRight className={`w-3 h-3 ${isSelected ? "text-indigo-200" : "text-zinc-400"}`} />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {/* Category button */}
        <button
          onClick={onSelect}
          className={`flex-1 text-left px-2 py-2 flex items-center gap-2 text-sm font-medium ${
            isSelected
              ? "text-white"
              : isCurrentPath
              ? "text-indigo-700 dark:text-indigo-300"
              : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          {isExpanded ? (
            <FolderOpen className={`w-4 h-4 ${isSelected ? "text-white" : "text-blue-500"}`} />
          ) : (
            <Folder className={`w-4 h-4 ${isSelected ? "text-white" : "text-blue-500"}`} />
          )}
          <span className="uppercase">{category.name}</span>
          <span className={`ml-auto text-xs ${isSelected ? "text-indigo-200" : "text-zinc-400"}`}>
            {category.count}
          </span>
        </button>
      </div>
    </div>
  );
});

CategoryItem.displayName = "CategoryItem";

export function CategorySidebar({
  posts,
  currentPath = [],
  selectedCategory,
  onSelectCategory,
  onBack,
  className = "",
}: CategorySidebarProps) {
  // Determine mode based on currentPath
  // Root mode: currentPath is empty - show top-level + children
  // Detail mode: currentPath has value - show currentPath[0]'s children + their children
  const isRootMode = currentPath.length === 0;
  const currentTopLevel = currentPath.length > 0 ? currentPath[0].toUpperCase() : null;

  // Manually expanded folders (chevron click, persists until manually closed)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    if (currentPath.length > 1) {
      // Auto-expand current path's parent
      const expanded = new Set<string>();
      expanded.add(currentPath[1]);
      return expanded;
    }
    return new Set();
  });

  // Focused folder (category click, temporary - clears when another is clicked)
  const [focusedFolder, setFocusedFolder] = useState<string | null>(null);

  // Build full category tree first
  const fullCategoryTree = useMemo(() => {
    const tree: CategoryTree[] = [];
    const pathMap = new Map<string, CategoryTree>();

    posts.forEach((post) => {
      if (post.path.length === 0) return;

      // Level 1: Top level category (e.g., AI, DEV, TRPG)
      const level1 = post.path[0].toUpperCase();
      let level1Node = pathMap.get(level1);
      if (!level1Node) {
        level1Node = { name: level1, path: [level1], count: 0, children: [] };
        pathMap.set(level1, level1Node);
        tree.push(level1Node);
      }
      level1Node.count++;

      // Level 2: Second level category (e.g., LLM, IMG)
      if (post.path.length > 1) {
        const level2 = post.path[1];
        const level2Key = `${level1}/${level2}`;
        let level2Node = pathMap.get(level2Key);
        if (!level2Node) {
          level2Node = { name: level2, path: [level1, level2], count: 0, children: [] };
          pathMap.set(level2Key, level2Node);
          level1Node.children.push(level2Node);
        }
        level2Node.count++;

        // Level 3: Third level category (e.g., Claude, Agents)
        if (post.path.length > 2) {
          const level3 = post.path[2];
          const level3Key = `${level1}/${level2}/${level3}`;
          let level3Node = pathMap.get(level3Key);
          if (!level3Node) {
            level3Node = { name: level3, path: [level1, level2, level3], count: 0, children: [] };
            pathMap.set(level3Key, level3Node);
            level2Node.children.push(level3Node);
          }
          level3Node.count++;
        }
      }
    });

    // Sort alphabetically
    const sortTree = (nodes: CategoryTree[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((node) => sortTree(node.children));
    };
    sortTree(tree);

    return tree;
  }, [posts]);

  // Get display tree based on mode
  const displayTree = useMemo(() => {
    if (isRootMode) {
      // Root mode: show top-level + their children (1 level)
      return fullCategoryTree.map(cat => ({
        ...cat,
        children: cat.children.map(child => ({
          ...child,
          children: [] // Only show 1 level of children
        }))
      }));
    } else {
      // Detail mode: show currentTopLevel's children as root + their children (1 level)
      const topLevelNode = fullCategoryTree.find(cat => cat.name === currentTopLevel);
      if (!topLevelNode) return [];

      return topLevelNode.children.map(child => ({
        ...child,
        // Adjust path to be relative (remove top-level prefix for display)
        children: child.children.map(grandchild => ({
          ...grandchild,
          children: [] // Only show 1 level of children
        }))
      }));
    }
  }, [fullCategoryTree, isRootMode, currentTopLevel]);

  // Toggle folder expansion (chevron click - permanent)
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

  // Handle category click - temporary expand (clears when another is clicked)
  const handleCategoryClick = useCallback((category: CategoryTree) => {
    const pathKey = category.path.join("/");
    // Set as focused (temporary expand)
    if (category.children.length > 0) {
      setFocusedFolder(pathKey);
    }
    // Call the selection handler
    onSelectCategory(category.path);
  }, [onSelectCategory]);

  // Check if a path is selected
  const isSelected = useCallback((path: string[]) => {
    if (!selectedCategory) return false;
    return selectedCategory.join("/") === path.join("/");
  }, [selectedCategory]);

  // Check if path is part of current post's path
  const isCurrentPathMatch = useCallback((path: string[]) => {
    if (currentPath.length === 0) return false;
    const normalizedCurrent = currentPath.map((p, i) => i === 0 ? p.toUpperCase() : p);
    const pathStr = path.join("/");
    const currentStr = normalizedCurrent.slice(0, path.length).join("/");
    return pathStr === currentStr;
  }, [currentPath]);

  // Render tree recursively
  const renderTree = (nodes: CategoryTree[], depth: number = 0): React.ReactNode => {
    return nodes.map((category) => {
      const pathKey = category.path.join("/");
      // Expanded if: manually expanded (chevron) OR focused (category click)
      const isExpanded = expandedFolders.has(pathKey) || focusedFolder === pathKey;
      const hasChildren = category.children.length > 0;
      const selected = isSelected(category.path);
      const isCurrent = isCurrentPathMatch(category.path);

      return (
        <div key={pathKey}>
          <CategoryItem
            category={category}
            isSelected={selected}
            isCurrentPath={isCurrent}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onSelect={() => handleCategoryClick(category)}
            onToggle={toggleFolder}
            depth={depth}
          />
          {isExpanded && hasChildren && (
            <div className="mt-1 space-y-1">
              {renderTree(category.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Count posts for "All" button
  const allPostCount = useMemo(() => {
    if (isRootMode) return posts.length;
    return posts.filter(p => p.path[0]?.toUpperCase() === currentTopLevel).length;
  }, [posts, isRootMode, currentTopLevel]);

  return (
    <aside className={`w-64 h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${className}`}>
      {/* Header */}
      <div className="h-[60px] px-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <Link href="/" className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Alice in HelloWorld
          </Link>
        )}
      </div>

      {/* Current Top-Level Header (only in detail mode) */}
      {!isRootMode && currentTopLevel && (
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            Current
          </div>
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase">
            {currentTopLevel}
          </div>
        </div>
      )}

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          {isRootMode ? "Categories" : "Browse"}
        </div>

        {/* All Posts button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
            selectedCategory === null
              ? "bg-indigo-500 text-white"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          {isRootMode ? "All Posts" : `All in ${currentTopLevel}`} ({allPostCount})
        </button>

        {/* Category Tree */}
        <div className="space-y-1">
          {renderTree(displayTree)}
        </div>
      </nav>
    </aside>
  );
}
