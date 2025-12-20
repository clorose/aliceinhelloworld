"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/lib/posts";
import { format } from "date-fns";
import { Search } from "lucide-react";

interface PostListProps {
  posts: BlogPost[];
  onSelect: (post: BlogPost) => void;
  onOpen: (post: BlogPost) => void;
  selectedPostId: string | null;
}

export function PostList({ posts, onSelect, onOpen, selectedPostId }: PostListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const lowerTerm = searchTerm.toLowerCase();
      return (
        post.slug.toLowerCase().includes(lowerTerm) ||
        (post.frontmatter.tags && post.frontmatter.tags.some(t => t.toLowerCase().includes(lowerTerm)))
      );
    });
  }, [posts, searchTerm]);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 min-w-0">
      {/* Search Filter Bar */}
      <div className="h-10 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-10">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400"
        />
      </div>

      {/* List Header */}
      <div className="grid grid-cols-[3fr_1.5fr_2fr] gap-4 px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500">
        <div>Name</div>
        <div>Date</div>
        <div>Tags</div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse text-sm">
          <tbody>
            {filteredPosts.map((post) => (
              <tr
                key={post.id}
                onClick={() => onSelect(post)}
                onDoubleClick={() => onOpen(post)}
                className={`cursor-default select-none border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 group ${selectedPostId === post.id ? "bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-600" : "text-zinc-700 dark:text-zinc-300"
                  }`}
              >
                <td className="px-4 py-2 font-medium truncate max-w-[300px]">
                  {post.slug}
                </td>
                <td className={`px-4 py-2 whitespace-nowrap ${selectedPostId === post.id ? "text-blue-100" : "text-zinc-500 dark:text-zinc-500"}`}>
                  {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1 flex-wrap">
                    {post.frontmatter.tags?.map(tag => (
                      <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-medium tracking-wide ${selectedPostId === post.id
                        ? "bg-white/20 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                        }`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}

            {filteredPosts.length === 0 && (
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
        {filteredPosts.length} items
      </div>
    </div>
  );
}
