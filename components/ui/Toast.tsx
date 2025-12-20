"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "error" | "info";
  onClose?: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-3 rounded-full shadow-lg border backdrop-blur-md flex items-center gap-3 z-50 min-w-[300px] justify-center ${type === "error"
          ? "bg-red-500/80 border-red-400 text-white"
          : "bg-zinc-800/80 border-zinc-700 text-white"
        }`}
    >
      {type === "error" ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
      <span className="font-medium text-sm">{message}</span>
    </motion.div>
  );
}
