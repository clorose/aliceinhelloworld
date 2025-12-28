"use client";

import React from "react";
import { motion } from "framer-motion";

interface AppIconProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function AppIcon({ title, icon, onClick }: AppIconProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 p-2 w-24 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-white/30"
      aria-label={`Open ${title}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-white shadow-lg rounded-2xl flex items-center justify-center text-zinc-900 overflow-hidden"
      >
        {/* Placeholder for actual icon content/image if needed, currently using passed svgs */}
        {icon}
      </motion.div>
      <span className="text-white text-xs font-medium drop-shadow-md px-2 py-0.5 rounded group-hover:bg-black/20 transition-colors truncate w-full text-center">
        {title}
      </span>
    </button>
  );
}
