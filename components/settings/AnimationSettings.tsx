"use client";

import React from "react";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { type SettingsSectionProps, t } from "./types";

interface AnimationSettingsProps extends SettingsSectionProps {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

export function AnimationSettings({
  language,
  animationsEnabled,
  setAnimationsEnabled,
}: AnimationSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {t(language, "애니메이션 설정", "Animation Settings")}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">
              {t(language, "애니메이션 활성화", "Enable Animations")}
            </label>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {t(
                language,
                "창 열기/닫기 및 UI 애니메이션을 제어합니다.",
                "Control window and UI animations."
              )}
            </p>
          </div>
          <ToggleSwitch
            checked={animationsEnabled}
            onChange={setAnimationsEnabled}
            aria-label={t(language, "애니메이션 활성화", "Enable Animations")}
          />
        </div>

        {!animationsEnabled && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-button">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t(
                language,
                "⚠️ 애니메이션이 비활성화되었습니다. UI가 즉시 표시됩니다.",
                "⚠️ Animations are disabled. UI will appear instantly."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
