import React from "react";

/**
 * Highlight matching text within a string
 * @param text - The text to search within
 * @param searchTerm - The term to highlight
 * @param className - CSS classes for the highlight mark (default: yellow bg)
 */
export function highlightText(
  text: string,
  searchTerm: string,
  className = "bg-yellow-200 dark:bg-yellow-600/50 text-inherit"
): React.ReactNode {
  if (!text || !searchTerm) return text;

  // Escape special regex characters
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const parts = text.split(new RegExp(`(${escapedTerm})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <mark key={index} className={className}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}
