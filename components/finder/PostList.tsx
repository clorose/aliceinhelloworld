"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { BlogPost, TreeNode } from "@/lib/posts";
import { buildPostTree } from "@/lib/tree-utils";
import { format } from "date-fns";
import { Search, ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { highlightText } from "@/lib/utils/highlight";
import { usePostSearch } from "@/hooks/usePostSearch";
import { useTreeNavigation } from "@/hooks/useTreeNavigation";

interface PostListProps {
  posts: BlogPost[];
  onSelect: (post: BlogPost) => void;
  onOpen: (post: BlogPost) => void;
  selectedPostId: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentPath: string[];
  rootPath: string[];
}

interface FlatNode {
  node: TreeNode;
  depth: number;
  isExpanded: boolean;
}

export function PostList({
  posts,
  onSelect,
  onOpen,
  selectedPostId,
  searchTerm,
  onSearchChange,
  currentPath,
  rootPath,
}: PostListProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedNodePath, setSelectedNodePath] = useState<string | null>(null); // For keyboard nav (files and folders)
  const containerRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-expand folders in currentPath (syncing UI state to navigation)
  useEffect(() => {
    if (currentPath.length > rootPath.length) {
      const newExpanded = new Set(expandedFolders);
      // Remove rootPath prefix to get relative path
      const relativePath = currentPath.slice(rootPath.length);
      let pathSoFar = "";
      relativePath.forEach((part) => {
        pathSoFar = pathSoFar ? `${pathSoFar}/${part}` : part;
        newExpanded.add(pathSoFar);
      });
       
      setExpandedFolders(newExpanded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, rootPath]);

  // Build tree from posts
  const tree = useMemo(() => buildPostTree(posts), [posts]);

  // Parse search term for tag filter (#tag syntax)
  const { normalSearch, tagFilters } = usePostSearch(searchTerm);

  // Filter and flatten tree for rendering
  const flatList = useMemo(() => {
    const result: FlatNode[] = [];
    const hasActiveFilter = normalSearch !== "" || tagFilters.length > 0;

    // Helper to check if folder has matching children
    const hasMatchingChildren = (node: TreeNode): boolean => {
      if (node.type === 'file') {
        const matchesSearch = normalSearch === "" ||
          !!(node.post?.slug.toLowerCase().includes(normalSearch.toLowerCase()) ||
          node.post?.frontmatter.title?.toLowerCase().includes(normalSearch.toLowerCase()) ||
          node.post?.frontmatter.description?.toLowerCase().includes(normalSearch.toLowerCase()) ||
          node.post?.frontmatter.tags?.some(t => t.toLowerCase().includes(normalSearch.toLowerCase())));

        const matchesTags = tagFilters.length === 0 ||
          tagFilters.every(tagFilter =>
            node.post?.frontmatter.tags?.some(t => t.toLowerCase().includes(tagFilter)) ?? false
          );

        return matchesSearch && matchesTags;
      }

      if (node.type === 'folder' && node.children) {
        return node.children.some(child => hasMatchingChildren(child));
      }

      return false;
    };

    const addNode = (node: TreeNode, depth: number) => {
      const matchesSearch = normalSearch === "" ||
        (node.type === 'file' && (
          node.post?.slug.toLowerCase().includes(normalSearch.toLowerCase()) ||
          node.post?.frontmatter.title?.toLowerCase().includes(normalSearch.toLowerCase()) ||
          node.post?.frontmatter.description?.toLowerCase().includes(normalSearch.toLowerCase()) ||
          node.post?.frontmatter.tags?.some(t => t.toLowerCase().includes(normalSearch.toLowerCase()))
        ));

      const matchesTags = tagFilters.length === 0 ||
        (node.type === 'file' && tagFilters.every(tagFilter =>
          node.post?.frontmatter.tags?.some(t => t.toLowerCase().includes(tagFilter))
        ));

      if (node.type === 'file' && matchesSearch && matchesTags) {
        result.push({ node, depth, isExpanded: false });
      } else if (node.type === 'folder') {
        // Auto-expand folders during search if they have matching children
        const shouldAutoExpand = hasActiveFilter && hasMatchingChildren(node);
        const isExpanded = shouldAutoExpand || expandedFolders.has(node.fullPath);

        result.push({ node, depth, isExpanded });

        if (isExpanded && node.children) {
          node.children.forEach(child => addNode(child, depth + 1));
        }
      }
    };

    tree.forEach(node => addNode(node, 0));
    return result;
  }, [tree, expandedFolders, normalSearch, tagFilters]);

  // Use tree navigation hook for keyboard navigation
  const { toggleFolder } = useTreeNavigation({
    containerRef,
    flatList,
    selectedNodePath,
    setSelectedNodePath,
    expandedFolders,
    setExpandedFolders,
    onSelect,
    onOpen,
  });

  // Sync selectedNodePath with selectedPostId to prevent duplicate highlights
  // Only sync when selectedPostId changes, NOT when flatList changes (to prevent focus hijacking)
  const prevSelectedPostIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only update if selectedPostId actually changed
    if (selectedPostId && selectedPostId !== prevSelectedPostIdRef.current) {
      prevSelectedPostIdRef.current = selectedPostId;

      // Find the post with this ID and set selectedNodePath
      const fileNode = flatList.find(
        ({ node }) => node.type === 'file' && node.post?.id === selectedPostId
      );
      if (fileNode) {
        // Use queueMicrotask to defer setState and avoid cascading renders
        queueMicrotask(() => {
          setSelectedNodePath(fileNode.node.fullPath);
        });
      }
    }
  }, [selectedPostId, flatList]);

  // Cleanup click timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex-1 flex flex-col bg-white dark:bg-zinc-950 min-w-0 outline-none overflow-hidden"
    >
      {/* Search Filter Bar */}
      <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2 sticky top-0 bg-white dark:bg-zinc-950 z-10">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search... (use #tag for tag filter)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400"
          aria-label="Search posts"
        />
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto">
        <table
          className="w-full text-left border-collapse text-sm table-fixed"
          role="grid"
          aria-label="Blog posts"
        >
          <thead className="sticky top-0 z-10">
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500">
              <th className="px-4 py-1.5 font-semibold text-left w-[45%]">Name</th>
              <th className="px-4 py-1.5 font-semibold text-left w-[25%]">Date</th>
              <th className="px-4 py-1.5 font-semibold text-left w-[30%]">Tags</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {flatList.map(({ node, depth, isExpanded }) => {
              // Only use selectedNodePath for selection (synced with selectedPostId via useEffect)
              const isSelected = selectedNodePath === node.fullPath;
              return (
                <tr
                  key={node.fullPath}
                  data-node-path={node.fullPath}
                  data-file-id={node.type === 'file' ? node.post?.id : undefined}
                  onClick={() => {
                    // Clear any pending click timeout
                    if (clickTimeoutRef.current) {
                      clearTimeout(clickTimeoutRef.current);
                    }

                    // Set keyboard selection
                    setSelectedNodePath(node.fullPath);

                    // Maintain focus for keyboard navigation
                    containerRef.current?.focus();

                    // Delay onClick to distinguish from double-click
                    clickTimeoutRef.current = setTimeout(() => {
                      if (node.type === 'folder') {
                        toggleFolder(node.fullPath);
                      } else if (node.post) {
                        onSelect(node.post);
                      }
                    }, 200);
                  }}
                  onDoubleClick={() => {
                    // Clear the pending single click
                    if (clickTimeoutRef.current) {
                      clearTimeout(clickTimeoutRef.current);
                      clickTimeoutRef.current = null;
                    }

                    // Maintain focus for keyboard navigation
                    containerRef.current?.focus();

                    if (node.type === 'file' && node.post) {
                      onOpen(node.post);
                    }
                  }}
                  tabIndex={-1}
                  role="row"
                  aria-selected={isSelected}
                  className={`cursor-default select-none border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 focus:outline-none group ${
                    isSelected
                      ? "bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-600"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <td className="px-4 py-2 font-medium truncate max-w-[300px]">
                    <div
                      className="flex items-center gap-2"
                      style={{ paddingLeft: `${depth * 20}px` }}
                    >
                      {node.type === 'folder' ? (
                        <>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          )}
                          <Folder className="w-4 h-4 shrink-0 text-blue-500" />
                          <span>{node.name}</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 shrink-0 ml-6 text-zinc-400" />
                          <span>{highlightText(node.post?.frontmatter.title || node.name, normalSearch)}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap ${
                      isSelected
                        ? "text-blue-100"
                        : "text-zinc-500 dark:text-zinc-500"
                    }`}
                  >
                    {node.type === 'file' && node.post && (
                      format(new Date(node.post.frontmatter.date), "MMM d, yyyy")
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {node.type === 'file' && node.post && (
                      <div className="flex gap-1 flex-wrap">
                        {node.post.frontmatter.tags?.map((tag) => {
                          const matchesTagFilter = tagFilters.some(filter =>
                            tag.toLowerCase().includes(filter.toLowerCase())
                          );
                          const matchesNormalSearch = normalSearch && tag.toLowerCase().includes(normalSearch.toLowerCase());
                          const isHighlighted = matchesTagFilter || matchesNormalSearch;

                          return (
                            <span
                              key={tag}
                              className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-medium tracking-wide ${
                                isHighlighted
                                  ? "bg-yellow-200 dark:bg-yellow-600 text-zinc-900 dark:text-white"
                                  : isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                              }`}
                            >
                              #{tag}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {flatList.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-zinc-400">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center px-4 text-xs text-zinc-500 justify-center">
        {flatList.length} items
      </div>
    </div>
  );
}
