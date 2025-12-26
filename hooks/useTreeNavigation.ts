"use client";

import { useEffect, useCallback, RefObject } from "react";
import { BlogPost, TreeNode } from "@/lib/posts";

interface FlatNode {
  node: TreeNode;
  depth: number;
  isExpanded: boolean;
}

interface UseTreeNavigationProps {
  containerRef: RefObject<HTMLDivElement | null>;
  flatList: FlatNode[];
  selectedNodePath: string | null;
  setSelectedNodePath: (path: string | null) => void;
  expandedFolders: Set<string>;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;
  onSelect: (post: BlogPost) => void;
  onOpen: (post: BlogPost) => void;
}

/**
 * Hook for keyboard navigation in tree structures
 * Handles ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Enter, Space
 */
export function useTreeNavigation({
  containerRef,
  flatList,
  selectedNodePath,
  setSelectedNodePath,
  expandedFolders,
  setExpandedFolders,
  onSelect,
  onOpen,
}: UseTreeNavigationProps) {
  const toggleFolder = useCallback(
    (path: string) => {
      setExpandedFolders((prev) => {
        const next = new Set(prev);
        if (next.has(path)) {
          next.delete(path);
        } else {
          next.add(path);
        }
        return next;
      });
      // Re-focus container after toggle to maintain keyboard navigation
      setTimeout(() => {
        containerRef.current?.focus();
      }, 0);
    },
    [setExpandedFolders, containerRef]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flatList.length === 0) return;

      // Find current selected index
      const currentIndex = flatList.findIndex(
        ({ node }) => node.fullPath === selectedNodePath
      );

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          currentIndex < flatList.length - 1 ? currentIndex + 1 : 0;
        const nextNode = flatList[nextIndex].node;

        setSelectedNodePath(nextNode.fullPath);

        // If it's a file, also select it in parent component
        if (nextNode.type === "file" && nextNode.post) {
          onSelect(nextNode.post);
        }

        // Scroll into view
        setTimeout(() => {
          const row = document.querySelector(
            `[data-node-path="${nextNode.fullPath}"]`
          );
          row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : flatList.length - 1;
        const prevNode = flatList[prevIndex].node;

        setSelectedNodePath(prevNode.fullPath);

        // If it's a file, also select it in parent component
        if (prevNode.type === "file" && prevNode.post) {
          onSelect(prevNode.post);
        }

        // Scroll into view
        setTimeout(() => {
          const row = document.querySelector(
            `[data-node-path="${prevNode.fullPath}"]`
          );
          row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const currentNode = flatList[currentIndex]?.node;
        if (currentNode?.type === "folder") {
          // Expand folder
          setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.add(currentNode.fullPath);
            return next;
          });
          // Re-focus to maintain keyboard navigation
          setTimeout(() => containerRef.current?.focus(), 0);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const currentNode = flatList[currentIndex]?.node;
        if (currentNode?.type === "folder") {
          // Collapse folder
          setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.delete(currentNode.fullPath);
            return next;
          });
          // Re-focus to maintain keyboard navigation
          setTimeout(() => containerRef.current?.focus(), 0);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        const currentNode = flatList[currentIndex]?.node;
        if (currentNode?.type === "file" && currentNode.post) {
          onOpen(currentNode.post);
        } else if (currentNode?.type === "folder") {
          // Toggle folder on Enter
          toggleFolder(currentNode.fullPath);
        }
      } else if (e.key === " ") {
        e.preventDefault();
        const currentNode = flatList[currentIndex]?.node;
        if (currentNode?.type === "file" && currentNode.post) {
          onSelect(currentNode.post);
        } else if (currentNode?.type === "folder") {
          // Toggle folder on Space
          toggleFolder(currentNode.fullPath);
        }
      }
    };

    // Only listen when container is focused
    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [
    flatList,
    selectedNodePath,
    setSelectedNodePath,
    setExpandedFolders,
    onSelect,
    onOpen,
    toggleFolder,
    containerRef,
  ]);

  return { toggleFolder };
}
