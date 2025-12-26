"use client";

import { useMemo } from "react";
import { BlogPost } from "@/lib/posts";

interface SearchResult {
  normalSearch: string;
  tagFilters: string[];
}

/**
 * Parse search term for tag filter (#tag syntax)
 * @param searchTerm - Raw search input
 * @returns Parsed search components
 */
export function parseSearchTerm(searchTerm: string): SearchResult {
  const tags: string[] = [];
  const words: string[] = [];

  searchTerm.split(/\s+/).forEach((word) => {
    if (word.startsWith("#") && word.length > 1) {
      tags.push(word.slice(1).toLowerCase());
    } else if (word) {
      words.push(word);
    }
  });

  return {
    normalSearch: words.join(" "),
    tagFilters: tags,
  };
}

/**
 * Check if a post matches search criteria
 */
export function postMatchesSearch(
  post: BlogPost,
  normalSearch: string,
  tagFilters: string[]
): boolean {
  const matchesSearch =
    normalSearch === "" ||
    post.slug.toLowerCase().includes(normalSearch.toLowerCase()) ||
    (post.frontmatter.title?.toLowerCase().includes(normalSearch.toLowerCase()) ?? false) ||
    (post.frontmatter.description?.toLowerCase().includes(normalSearch.toLowerCase()) ?? false) ||
    (post.frontmatter.tags?.some((t) =>
      t.toLowerCase().includes(normalSearch.toLowerCase())
    ) ?? false);

  const matchesTags =
    tagFilters.length === 0 ||
    tagFilters.every((tagFilter) =>
      post.frontmatter.tags?.some((t) => t.toLowerCase().includes(tagFilter)) ?? false
    );

  return matchesSearch && matchesTags;
}

/**
 * Hook for parsing and managing post search
 */
export function usePostSearch(searchTerm: string) {
  return useMemo(() => parseSearchTerm(searchTerm), [searchTerm]);
}
