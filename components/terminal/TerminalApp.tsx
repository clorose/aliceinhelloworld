"use client";

import React, { useState, useRef, useEffect } from "react";
import { executeCommand } from "@/lib/terminal/commands";
import type { TerminalOutput } from "@/lib/terminal/types";
import type { BlogPost } from "@/lib/posts";
import { useTheme } from "next-themes";

// Import command modules to register them
import "@/lib/terminal/commands/basic";
import "@/lib/terminal/commands/blog";
import "@/lib/terminal/commands/system";

const ASCII_ART = `
    _    _ _          _        _   _      _ _   __        __         _     _
   / \\  | (_) ___ ___( )___   | | | | ___| | | __\\ \\      / /__  _ __| | __| |
  / _ \\ | | |/ __/ _ \\// __|  | |_| |/ _ \\ | |/ _ \\ \\ /\\ / / _ \\| '__| |/ _\` |
 / ___ \\| | | (_|  __/ \\__ \\  |  _  |  __/ | | (_) \\ V  V / (_) | |  | | (_| |
/_/   \\_\\_|_|\\___\\___| |___/  |_| |_|\\___|_|_|\\___/ \\_/\\_/ \\___/|_|  |_|\\__,_|

Welcome to Alice's Terminal! Type 'help' for available commands.
`;

interface TerminalAppProps {
  posts?: BlogPost[];
}

export function TerminalApp({ posts = [] }: TerminalAppProps) {
  const [history, setHistory] = useState<TerminalOutput[]>([
    { type: "info", content: ASCII_ART },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState("~");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Listen for theme change events from terminal commands
  const { setTheme } = useTheme();
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<{ theme: string }>) => {
      setTheme(e.detail.theme as "light" | "dark" | "system");
    };

    window.addEventListener(
      "terminal-theme-change",
      handleThemeChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "terminal-theme-change",
        handleThemeChange as EventListener
      );
    };
  }, [setTheme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add command to history
    const newHistory = [...commandHistory, input];
    setCommandHistory(newHistory);
    setHistoryIndex(-1);

    const trimmedInput = input.trim();
    const parts = trimmedInput.split(/\s+/);
    const cmd = parts[0].toLowerCase();

    // Handle cd command (change directory)
    if (cmd === "cd") {
      const newPath = parts[1] || "~";
      setCurrentPath(newPath);
      setHistory((prev) => [
        ...prev,
        { type: "command", content: input },
      ]);
      setInput("");
      return;
    }

    // Handle pwd command (print working directory)
    if (cmd === "pwd") {
      setHistory((prev) => [
        ...prev,
        { type: "command", content: input },
        { type: "output", content: currentPath },
      ]);
      setInput("");
      return;
    }

    // Execute command
    const output = executeCommand(trimmedInput, posts);

    // Check if clear command
    if (output.length === 1 && output[0].content === "__CLEAR__") {
      setHistory([{ type: "info", content: ASCII_ART }]);
      setInput("");
      return;
    }

    // Add to display history
    setHistory((prev) => [
      ...prev,
      { type: "command", content: input },
      ...output,
    ]);

    // Clear input
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div
      className="h-full bg-black text-green-400 font-mono text-sm flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output area */}
      <div ref={outputRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.map((item, index) => (
          <div key={index}>
            {item.type === "command" && (
              <div className="flex items-center gap-2 mb-1 font-mono text-sm">
                {/* OS segment */}
                <span className="bg-blue-500 text-white px-3 py-1 flex items-center gap-1.5 rounded">
                  <span>🐇</span>
                  <span className="font-semibold">alice</span>
                </span>

                {/* Directory segment */}
                <span className="bg-cyan-600 text-white px-3 py-1 flex items-center gap-1.5 rounded">
                  <span>📁</span>
                  <span>{currentPath}</span>
                </span>
              </div>
            )}
            <pre className={`whitespace-pre-wrap font-mono ${getLineClass(item.type)}`}>{item.content}</pre>
          </div>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-green-900 p-4">
        <div className="space-y-2">
          {/* Prompt line */}
          <div className="flex items-center gap-2 font-mono text-sm">
            {/* OS segment */}
            <span className="bg-blue-500 text-white px-3 py-1 flex items-center gap-1.5 rounded">
              <span>🐇</span>
              <span className="font-semibold">alice</span>
            </span>

            {/* Directory segment */}
            <span className="bg-cyan-600 text-white px-3 py-1 flex items-center gap-1.5 rounded">
              <span>📁</span>
              <span>{currentPath}</span>
            </span>
          </div>

          {/* Input line */}
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold text-lg">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-400 font-mono"
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

function getLineClass(type: TerminalOutput["type"]): string {
  switch (type) {
    case "command":
      return "text-green-400 font-bold";
    case "success":
      return "text-green-300";
    case "error":
      return "text-red-400";
    case "info":
      return "text-cyan-400";
    case "output":
      return "text-gray-300";
    default:
      return "text-gray-400";
  }
}
