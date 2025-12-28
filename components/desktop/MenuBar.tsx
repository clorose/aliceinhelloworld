"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Rabbit, Wifi, Battery, Search, Command, Sun, Moon, PanelBottom, Terminal } from "lucide-react";
import { Home } from "lucide-react";
import { useDesktopStore } from "@/lib/stores/desktop-store";
import { useTheme } from "next-themes";

interface MenuBarProps {
  onTerminalClick?: () => void;
  onSearchClick?: () => void;
  isTerminalOpen?: boolean;
}

export function MenuBar({ onTerminalClick, onSearchClick, isTerminalOpen }: MenuBarProps) {
  const [time, setTime] = useState<Date>(new Date());
  const { toggleShowDesktop, toggleMissionControl, showDesktop, toggleDock, dockOpen } =
    useDesktopStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration safety pattern
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

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
    <div className="fixed top-0 left-0 right-0 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center px-4 justify-between z-50 text-white text-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          className="hover:bg-white/20 p-1 rounded-sm transition-colors"
          aria-label="AliceOS menu"
        >
          <Rabbit className="w-4 h-4" fill="currentColor" />
        </button>
        <span className="font-semibold">AliceOS</span>

        <div className="h-4 w-[1px] bg-white/30 mx-2" />

        <button
          onClick={toggleMissionControl}
          className="flex items-center gap-1 hover:bg-white/20 px-2 py-0.5 rounded-sm transition-colors"
          title="Mission Control (Ctrl + `)"
        >
          <Command className="w-3 h-3" />
          <span>Mission Control</span>
        </button>

        <button
          onClick={toggleDock}
          className={`flex items-center gap-1 hover:bg-white/20 px-2 py-0.5 rounded-sm transition-colors ${dockOpen ? "bg-white/30" : ""}`}
          title="Dock"
        >
          <PanelBottom className="w-3 h-3" />
          <span>Dock</span>
        </button>

        <button
          onClick={onSearchClick}
          className="flex items-center gap-1 hover:bg-white/20 px-2 py-0.5 rounded-sm transition-colors"
          title="Quick Search (Cmd+K)"
        >
          <Search className="w-3 h-3" />
          <span>Quick Search</span>
        </button>

        <button
          onClick={onTerminalClick}
          className={`flex items-center gap-1 hover:bg-white/20 px-2 py-0.5 rounded-sm transition-colors ${isTerminalOpen ? "bg-white/30" : ""}`}
          title="Terminal"
        >
          <Terminal className="w-3 h-3" />
          <span>Terminal</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-2">
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>

        <span className="font-medium">{format(time, "MMM d EEE HH:mm")}</span>

        <div className="h-4 w-[1px] bg-white/30 mx-2" />

        <button
          onClick={toggleTheme}
          className="hover:bg-white/20 p-1 rounded-sm transition-colors"
          title={`Theme: ${theme} (${isDark ? 'Dark' : 'Light'})`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleShowDesktop}
          className={`hover:bg-white/20 p-1 rounded-sm transition-colors ${showDesktop ? "bg-white/30" : ""}`}
          title="Show Desktop"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
