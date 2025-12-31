"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { type SettingsSectionProps, t } from "./types";

interface FontSettingsProps extends SettingsSectionProps {
  fontSize: number;
  setFontSize: (size: number) => void;
}

export function FontSettings({
  language,
  fontSize,
  setFontSize,
}: FontSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {t(language, "폰트 설정", "Font Settings")}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t(language, "폰트 크기", "Font Size")}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="12"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="flex-1 h-2 bg-surface-secondary dark:bg-surface-dark-secondary rounded-full appearance-none cursor-pointer accent-accent dark:accent-accent-dark"
            />
            <Badge variant="neutral">{fontSize}px</Badge>
          </div>
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
            {t(
              language,
              "전역 폰트 크기를 조절합니다. (12px - 20px)",
              "Adjust the global font size. (12px - 20px)"
            )}
          </p>
        </div>

        <div className="p-4 border border-border dark:border-border-dark rounded-button">
          <p style={{ fontSize: `${fontSize}px` }}>
            {t(
              language,
              "폰트 크기 미리보기 - AliceOS에 오신 것을 환영합니다!",
              "Font size preview - Welcome to AliceOS!"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
