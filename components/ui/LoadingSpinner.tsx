"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  // macOS-style spinner with multiple bars
  const barCount = 12;
  const bars = Array.from({ length: barCount });

  const sizeConfig = {
    sm: { container: 16, barWidth: 2, barHeight: 5 },
    md: { container: 32, barWidth: 3, barHeight: 9 },
    lg: { container: 48, barWidth: 4, barHeight: 14 },
  };

  const config = sizeConfig[size];
  const radius = config.container / 2 - config.barHeight / 2;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <motion.div
        className="relative"
        style={{
          width: config.container,
          height: config.container,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        role="status"
        aria-label="Loading"
      >
        {bars.map((_, i) => {
          const angle = (i * 360) / barCount;
          const delay = i * (1 / barCount);

          return (
            <motion.div
              key={i}
              className="absolute bg-zinc-400 dark:bg-zinc-600 rounded-full"
              style={{
                width: config.barWidth,
                height: config.barHeight,
                left: "50%",
                top: "50%",
                transformOrigin: `${config.barWidth / 2}px ${radius}px`,
                transform: `translateX(-50%) translateY(-${radius}px) rotate(${angle}deg)`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>
      {message && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
