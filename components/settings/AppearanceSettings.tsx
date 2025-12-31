"use client";

import React from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { Sun, Moon, Laptop } from "lucide-react";
import { type SettingsSectionProps, t } from "./types";

type Theme = "light" | "dark" | "system";

interface AppearanceSettingsProps extends SettingsSectionProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export function AppearanceSettings({
  language,
  theme,
  setTheme,
}: AppearanceSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {t(language, "테마 설정", "Appearance Settings")}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t(language, "테마", "Theme")}
          </label>
          <Dropdown
            options={[
              { value: "light", label: t(language, "라이트", "Light") },
              { value: "dark", label: t(language, "다크", "Dark") },
              { value: "system", label: t(language, "시스템", "System") },
            ]}
            value={theme}
            onChange={(value) => setTheme(value as Theme)}
            size="sm"
          />
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
            {t(
              language,
              "AliceOS의 색상 테마를 설정합니다.",
              "Set the color theme for AliceOS."
            )}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ThemeButton
            theme="light"
            currentTheme={theme}
            onClick={() => setTheme("light")}
            icon={<Sun size={24} />}
            label={t(language, "라이트", "Light")}
          />
          <ThemeButton
            theme="dark"
            currentTheme={theme}
            onClick={() => setTheme("dark")}
            icon={<Moon size={24} />}
            label={t(language, "다크", "Dark")}
          />
          <ThemeButton
            theme="system"
            currentTheme={theme}
            onClick={() => setTheme("system")}
            icon={<Laptop size={24} />}
            label={t(language, "시스템", "System")}
          />
        </div>
      </div>
    </div>
  );
}

interface ThemeButtonProps {
  theme: Theme;
  currentTheme: Theme;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ThemeButton({
  theme,
  currentTheme,
  onClick,
  icon,
  label,
}: ThemeButtonProps) {
  const isActive = theme === currentTheme;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-button border-2 transition-colors ${
        isActive
          ? "border-accent bg-accent/10 dark:border-accent-dark dark:bg-accent-dark/10"
          : "border-border dark:border-border-dark hover:border-accent dark:hover:border-accent-dark"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
