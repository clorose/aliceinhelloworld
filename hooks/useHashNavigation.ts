"use client";

import { useEffect } from "react";
import { BlogPost } from "@/lib/posts";

interface UseHashNavigationProps {
  posts: BlogPost[];
  onOpenPost: (post: BlogPost) => void;
  prefix?: string;
}

/**
 * Hook for handling URL hash navigation
 * Opens posts based on hash like #post-ai/llm/post-1
 */
export function useHashNavigation({
  posts,
  onOpenPost,
  prefix = "post-",
}: UseHashNavigationProps) {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith(`#${prefix}`)) {
        const postId = hash.replace(`#${prefix}`, "");
        const post = posts.find((p) => p.id === postId);
        if (post) {
          onOpenPost(post);
          // Clear hash after opening
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [posts, onOpenPost, prefix]);
}
