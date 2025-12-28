"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktopStore } from "@/lib/stores/desktop-store";
import { X } from "lucide-react";

export function MissionControl() {
  const { missionControlOpen, windows, toggleMissionControl, bringToFront } =
    useDesktopStore();

  return (
    <AnimatePresence>
      {missionControlOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-md flex flex-col pt-12 pb-8 px-8"
          onClick={(e) => {
            // Close if clicking the background
            if (e.target === e.currentTarget) toggleMissionControl();
          }}
        >
          <div className="flex justify-between items-center mb-8 text-white px-4">
            <h2 className="text-2xl font-light tracking-tight">
              Mission Control
            </h2>
            <button
              onClick={toggleMissionControl}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-y-auto p-4">
            {windows
              .filter((w) => w.isOpen)
              .map((window) => (
                <motion.button
                  key={window.id}
                  layoutId={`mission-control-${window.id}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    bringToFront(window.id);
                    toggleMissionControl(); // Close MC when selecting a window
                  }}
                  className="aspect-video bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
                >
                  {/* Title Bar simplified */}
                  <div className="absolute top-0 inset-x-0 h-8 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 flex items-center px-4 gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    <span className="text-xs text-zinc-500 font-medium truncate">
                      {window.title}
                    </span>
                  </div>

                  {/* Icon & Title Large */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="scale-150 text-zinc-700 dark:text-zinc-300">
                      {window.icon}
                    </div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200 mt-2">
                      {window.title}
                    </span>
                  </div>
                </motion.button>
              ))}

            {windows.filter((w) => w.isOpen).length === 0 && (
              <div className="col-span-full h-64 flex items-center justify-center text-white/50 text-lg">
                No open windows
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
