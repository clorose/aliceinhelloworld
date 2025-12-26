"use client";

import { useEffect } from "react";

interface UseGlobalShortcutsProps {
  onQuickSearch?: () => void;
  onMissionControl?: () => void;
  onTerminal?: () => void;
  isTerminalOpen?: boolean;
}

/**
 * Hook for global keyboard shortcuts
 * - Cmd/Ctrl+K: Quick Search
 * - Ctrl+`: Mission Control / Terminal toggle
 */
export function useGlobalShortcuts({
  onQuickSearch,
  onMissionControl,
  onTerminal,
  isTerminalOpen,
}: UseGlobalShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Quick Search: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onQuickSearch?.();
      }
      // Mission Control or Terminal: Ctrl + `
      else if (e.ctrlKey && e.code === "Backquote") {
        e.preventDefault();
        if (onTerminal) {
          onTerminal();
        } else if (onMissionControl) {
          onMissionControl();
        }
      }
      // Close terminal with Escape
      else if (e.key === "Escape" && isTerminalOpen && onTerminal) {
        onTerminal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onQuickSearch, onMissionControl, onTerminal, isTerminalOpen]);
}
