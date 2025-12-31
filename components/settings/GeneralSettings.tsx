"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { type SettingsSectionProps, t } from "./types";

interface GeneralSettingsProps extends SettingsSectionProps {
  windowDefaultWidth: number;
  windowDefaultHeight: number;
  setWindowDefaultSize: (width: number, height: number) => void;
  autoSave: boolean;
  setAutoSave: (value: boolean) => void;
}

export function GeneralSettings({
  language,
  windowDefaultWidth,
  windowDefaultHeight,
  setWindowDefaultSize,
  autoSave,
  setAutoSave,
}: GeneralSettingsProps) {
  const [tempWidth, setTempWidth] = useState(windowDefaultWidth.toString());
  const [tempHeight, setTempHeight] = useState(windowDefaultHeight.toString());

  const handleWindowSizeChange = () => {
    const width = parseInt(tempWidth) || 800;
    const height = parseInt(tempHeight) || 600;
    setWindowDefaultSize(width, height);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {t(language, "일반 설정", "General Settings")}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t(language, "기본 창 크기", "Default Window Size")}
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                type="number"
                value={tempWidth}
                onChange={(e) => setTempWidth(e.target.value)}
                onBlur={handleWindowSizeChange}
                placeholder="Width"
                size="sm"
              />
            </div>
            <span className="text-text-secondary dark:text-text-secondary-dark">
              ×
            </span>
            <div className="flex-1">
              <Input
                type="number"
                value={tempHeight}
                onChange={(e) => setTempHeight(e.target.value)}
                onBlur={handleWindowSizeChange}
                placeholder="Height"
                size="sm"
              />
            </div>
          </div>
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
            {t(
              language,
              "새로 열리는 창의 기본 크기를 설정합니다.",
              "Set the default size for newly opened windows."
            )}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">
              {t(language, "자동 저장", "Auto Save")}
            </label>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {t(
                language,
                "창 위치와 크기를 자동으로 저장합니다.",
                "Automatically save window positions and sizes."
              )}
            </p>
          </div>
          <ToggleSwitch
            checked={autoSave}
            onChange={setAutoSave}
            aria-label={t(language, "자동 저장", "Auto Save")}
          />
        </div>
      </div>
    </div>
  );
}
