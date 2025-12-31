"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useDesktopStore } from "@/lib/stores/desktop-store";
import {
  Settings as SettingsIcon,
  Palette,
  Type,
  Sparkles,
  Globe,
  RotateCcw,
} from "lucide-react";

import { GeneralSettings } from "./GeneralSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { FontSettings } from "./FontSettings";
import { AnimationSettings } from "./AnimationSettings";
import { LanguageSettings } from "./LanguageSettings";
import { ResetSettings } from "./ResetSettings";

type SettingsCategory =
  | "general"
  | "appearance"
  | "fonts"
  | "animations"
  | "language"
  | "reset";

const categories = [
  { id: "general" as const, label: "General", icon: <SettingsIcon size={16} /> },
  { id: "appearance" as const, label: "Appearance", icon: <Palette size={16} /> },
  { id: "fonts" as const, label: "Fonts", icon: <Type size={16} /> },
  { id: "animations" as const, label: "Animations", icon: <Sparkles size={16} /> },
  { id: "language" as const, label: "Language", icon: <Globe size={16} /> },
  { id: "reset" as const, label: "Reset", icon: <RotateCcw size={16} /> },
];

export function SettingsApp() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("general");

  // Use next-themes for actual theme switching
  const { setTheme: setNextTheme } = useTheme();

  const {
    theme,
    setTheme: setStoreTheme,
    fontSize,
    setFontSize,
    animationsEnabled,
    setAnimationsEnabled,
    language,
    setLanguage,
    windowDefaultWidth,
    windowDefaultHeight,
    setWindowDefaultSize,
    autoSave,
    setAutoSave,
    resetAllSettings,
  } = useSettingsStore();

  // Sync theme changes to both stores
  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setStoreTheme(newTheme);
    setNextTheme(newTheme);
  };

  const { resetAllWindows } = useDesktopStore();

  const handleResetAll = () => {
    resetAllSettings();
    resetAllWindows();
  };

  const renderContent = () => {
    switch (activeCategory) {
      case "general":
        return (
          <GeneralSettings
            language={language}
            windowDefaultWidth={windowDefaultWidth}
            windowDefaultHeight={windowDefaultHeight}
            setWindowDefaultSize={setWindowDefaultSize}
            autoSave={autoSave}
            setAutoSave={setAutoSave}
          />
        );
      case "appearance":
        return (
          <AppearanceSettings
            language={language}
            theme={theme}
            setTheme={setTheme}
          />
        );
      case "fonts":
        return (
          <FontSettings
            language={language}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        );
      case "animations":
        return (
          <AnimationSettings
            language={language}
            animationsEnabled={animationsEnabled}
            setAnimationsEnabled={setAnimationsEnabled}
          />
        );
      case "language":
        return (
          <LanguageSettings language={language} setLanguage={setLanguage} />
        );
      case "reset":
        return <ResetSettings language={language} onResetAll={handleResetAll} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-surface-primary dark:bg-surface-dark-primary">
      {/* Sidebar */}
      <div className="w-48 border-r border-border dark:border-border-dark bg-surface-secondary dark:bg-surface-dark-secondary p-3">
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-button text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-white"
                  : "text-text-primary hover:bg-surface-hover dark:text-text-primary-dark dark:hover:bg-surface-dark-hover"
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
    </div>
  );
}
