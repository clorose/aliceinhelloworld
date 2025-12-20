"use client";

import React, { useMemo } from "react";
import { BlogPost } from "@/lib/posts";
import { format } from "date-fns";
import { POST_MAP } from "@/lib/post-map";

interface PostReaderProps {
  post: BlogPost;
  onTagClick: (tag: string) => void;
}

export function PostReader({ post, onTagClick }: PostReaderProps) {
  // Use the static map. If not found, show error.
  const MDXContent = POST_MAP[post.id] || (() => <div className="p-4 text-red-500">Content not found for id: {post.id}</div>);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 p-8 md:p-12 min-w-0">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">{post.slug}</h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <time dateTime={post.frontmatter.date}>
              {format(new Date(post.frontmatter.date), 'MMMM d, yyyy')}
            </time>
          </div>
        </header>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-12">
          <MDXContent />
        </div>

        {/* Bottom HashTags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 mt-12">
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
