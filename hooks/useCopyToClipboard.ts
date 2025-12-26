"use client";

import { useState, useCallback } from "react";

/**
 * Hook for copying text to clipboard with feedback state
 * @param resetDelay - Time in ms before `copied` resets to false (default: 2000)
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      } catch {
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copy };
}
