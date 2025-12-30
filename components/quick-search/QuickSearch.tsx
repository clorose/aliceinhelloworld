"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, ArrowRight, Hash } from "lucide-react";
import Fuse from "fuse.js";
import { BlogPost } from "@/lib/posts";

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
}

export function QuickSearch({ isOpen, onClose, posts, onOpenPost }: QuickSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create Fuse instance for fuzzy search
  const fuse = useMemo(() => new Fuse(posts, {
    keys: [
      { name: "frontmatter.title", weight: 0.4 },
      { name: "frontmatter.description", weight: 0.2 },
      { name: "frontmatter.tags", weight: 0.2 },
      { name: "slug", weight: 0.1 },
      { name: "path", weight: 0.1 },
    ],
    threshold: 0.4, // 0 = exact match, 1 = match anything
    includeScore: true,
  }), [posts]);

  // Filter and search posts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      // Show recent posts when no query
      return posts.slice(0, 8);
    }

    const query = searchQuery.toLowerCase();
    const isTagSearch = query.startsWith("#");

    if (isTagSearch) {
      // Tag search - exact match for tags
      const searchTerm = query.slice(1);
      return posts.filter((post) =>
        post.frontmatter.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm)
        )
      ).slice(0, 10);
    }

    // Fuzzy search with Fuse.js
    return fuse.search(searchQuery).slice(0, 10).map(result => result.item);
  }, [searchQuery, posts, fuse]);

  // Reset selected index when results change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [searchResults]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery("");
       
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelectPost = useCallback((post: BlogPost) => {
    onOpenPost(post);
    onClose();
  }, [onOpenPost, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleSelectPost(searchResults[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, searchResults, selectedIndex, onClose, handleSelectPost]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[400]"
            onClick={onClose}
          />

          {/* Quick Search Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[401]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="backdrop-blur-2xl bg-white dark:bg-zinc-900 text-black dark:text-white rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts... (use #tag for tag search)"
                  className="flex-1 bg-transparent outline-none text-black dark:text-white placeholder:text-zinc-500"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-600">
                  <Command className="w-3 h-3" />K
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((post, index) => (
                        <button
                          key={post.id}
                          onClick={() => handleSelectPost(post)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors ${
                            index === selectedIndex
                              ? "bg-zinc-100 dark:bg-zinc-800"
                              : ""
                          }`}
                        >
                          <div className="flex-1 text-left">
                            <div className="font-medium text-zinc-900 dark:text-zinc-100">
                              {post.frontmatter.title}
                            </div>
                          {post.frontmatter.description && (
                            <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                              {post.frontmatter.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {post.path[0]}
                            </span>
                            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                {post.frontmatter.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-1.5 py-0.5 bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 rounded flex items-center gap-0.5"
                                  >
                                    <Hash className="w-3 h-3" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {index === selectedIndex && (
                          <ArrowRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No posts found</p>
                    {searchQuery && (
                      <p className="text-sm mt-1">
                        Try a different search term or use #tag
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-600">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-600">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-600">ESC</kbd>
                    Close
                  </span>
                </div>
                <span>{searchResults.length} results</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
