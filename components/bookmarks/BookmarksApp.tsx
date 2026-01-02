"use client";

import { BlogPost } from "@/lib/posts";
import { useState, useEffect, useMemo } from "react";
import { Bookmark, BookmarkCheck, Trash2, Search } from "lucide-react";

interface BookmarksAppProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
}

export function BookmarksApp({ posts, onOpenPost }: BookmarksAppProps) {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Load from localStorage (external system sync - valid useEffect pattern)
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    const savedRead = localStorage.getItem("readPosts");

    if (savedBookmarks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));
    }
    if (savedRead) {
       
      setReadIds(new Set(JSON.parse(savedRead)));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(Array.from(bookmarkedIds)));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem("readPosts", JSON.stringify(Array.from(readIds)));
  }, [readIds]);

  // Get bookmarked posts
  const bookmarkedPosts = useMemo(() => {
    return posts.filter(post => bookmarkedIds.has(post.id));
  }, [posts, bookmarkedIds]);

  // Filter and search
  const filteredPosts = useMemo(() => {
    let result = bookmarkedPosts;

    // Filter by read/unread
    if (filter === "read") {
      result = result.filter(post => readIds.has(post.id));
    } else if (filter === "unread") {
      result = result.filter(post => !readIds.has(post.id));
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(post =>
        post.frontmatter.title.toLowerCase().includes(term) ||
        post.frontmatter.description?.toLowerCase().includes(term) ||
        post.frontmatter.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return result;
  }, [bookmarkedPosts, filter, searchTerm, readIds]);

  const toggleBookmark = (postId: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const toggleRead = (postId: string) => {
    setReadIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handleOpenPost = (post: BlogPost) => {
    // Mark as read
    if (!readIds.has(post.id)) {
      toggleRead(post.id);
    }
    onOpenPost(post);
  };

  const clearAllBookmarks = () => {
    if (confirm("모든 북마크를 삭제하시겠습니까?")) {
      setBookmarkedIds(new Set());
      setReadIds(new Set());
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Bookmarks
          </h2>
          {bookmarkedIds.size > 0 && (
            <button
              onClick={clearAllBookmarks}
              className="flex items-center gap-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filter === "all"
                ? "bg-indigo-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            All ({bookmarkedPosts.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filter === "unread"
                ? "bg-indigo-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Unread ({bookmarkedPosts.filter(p => !readIds.has(p.id)).length})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filter === "read"
                ? "bg-indigo-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            Read ({bookmarkedPosts.filter(p => readIds.has(p.id)).length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const isRead = readIds.has(post.id);

              return (
                <div
                  key={post.id}
                  className="group p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleOpenPost(post)}
                      className="flex-1 text-left"
                    >
                      <h3 className={`font-medium mb-1 ${
                        isRead
                          ? "text-zinc-500 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}>
                        {post.frontmatter.title}
                      </h3>
                      {post.frontmatter.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                          {post.frontmatter.description}
                        </p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {post.frontmatter.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </button>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleRead(post.id)}
                        className={`p-2 rounded transition-colors ${
                          isRead
                            ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                            : "text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                        title={isRead ? "Mark as unread" : "Mark as read"}
                      >
                        <BookmarkCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className="p-2 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : bookmarkedIds.size === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">No bookmarks yet</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-600">
              Bookmark posts to read them later
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">No matching bookmarks</p>
          </div>
        )}
      </div>
    </div>
  );
}
