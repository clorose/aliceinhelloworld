"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Rabbit, Wifi, Battery, Search, Sun, Moon, Terminal, Monitor } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

interface BlogMenuBarProps {
  onTerminalClick?: () => void;
  onSearchClick?: () => void;
  onCalendarClick?: () => void;
  isTerminalOpen?: boolean;
  isCalendarOpen?: boolean;
}

export function BlogMenuBar({ onTerminalClick, onSearchClick, onCalendarClick, isTerminalOpen, isCalendarOpen }: BlogMenuBarProps) {
  const [time, setTime] = useState<Date>(new Date());
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMac, setIsMac] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Hydration safety pattern
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Browser API access requires useEffect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div className="h-8 bg-zinc-900/90 backdrop-blur-md flex items-center px-4 justify-between z-50 text-white text-sm flex-shrink-0">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors"
        >
          <Rabbit className="w-4 h-4" fill="currentColor" />
          <span className="font-semibold">AliceOS</span>
        </Link>

        <div className="h-4 w-[1px] bg-white/30 mx-2" />

        <button
          onClick={onSearchClick}
          className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors"
          title={`Quick Search (${isMac ? "⌘K" : "Ctrl+K"})`}
        >
          <Search className="w-3 h-3" />
          <span>Quick Search</span>
        </button>

        <button
          onClick={onTerminalClick}
          className={`flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors ${isTerminalOpen ? "bg-white/20" : ""}`}
          title="Terminal (Ctrl+`)"
        >
          <Terminal className="w-3 h-3" />
          <span>Terminal</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-2 text-white/60">
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>

        <button
          onClick={onCalendarClick}
          className={`font-medium hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors ${isCalendarOpen ? "bg-white/20" : ""}`}
          title="Calendar"
        >
          {format(time, "MMM d EEE HH:mm")}
        </button>

        <div className="h-4 w-[1px] bg-white/30 mx-2" />

        <button
          onClick={toggleTheme}
          className="hover:bg-white/10 p-1 rounded-sm transition-colors"
          title={mounted ? `Theme: ${theme} (${isDark ? 'Dark' : 'Light'})` : "Theme"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <Link
          href="/desktop"
          className="flex items-center gap-1 hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors"
          title="Desktop Mode"
        >
          <Monitor className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
