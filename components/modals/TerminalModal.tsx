"use client";

import { X } from "lucide-react";
import { TerminalApp } from "@/components/terminal/TerminalApp";
import { BlogPost } from "@/lib/posts";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export function TerminalModal({ isOpen, onClose, posts }: TerminalModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[70vh] mx-4 bg-zinc-900 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="h-9 bg-zinc-800 flex items-center px-4 justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              title="Close"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-zinc-400">Terminal</span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Terminal Content */}
        <div className="flex-1 overflow-hidden">
          <TerminalApp posts={posts} />
        </div>
      </div>
    </div>
  );
}
