"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Rabbit, Wifi, Battery, Search, Monitor, Command } from "lucide-react"; // Using Monitor as simple placeholder if Show Desktop icon needed, but user asked for "Show Desktop" button. 
// "Home" (🏠) button to minimize/hide all windows. 
import { Home } from "lucide-react";
import { useDesktopStore } from "@/lib/stores/desktop-store";

export function MenuBar() {
  const [time, setTime] = useState<Date | null>(null);
  const { toggleShowDesktop, toggleMissionControl, showDesktop } = useDesktopStore();

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center px-4 justify-between z-50 text-white text-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button className="hover:bg-white/20 p-1 rounded-sm transition-colors">
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
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-2">
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
          <Search className="w-4 h-4" />
        </div>

        <span className="font-medium">
          {time ? format(time, "MMM d EEE HH:mm") : "..."}
        </span>

        <div className="h-4 w-[1px] bg-white/30 mx-2" />

        <button
          onClick={toggleShowDesktop}
          className={`hover:bg-white/20 p-1 rounded-sm transition-colors ${showDesktop ? 'bg-white/30' : ''}`}
          title="Show Desktop"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
