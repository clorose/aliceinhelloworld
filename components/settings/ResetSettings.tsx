"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { type SettingsSectionProps, t } from "./types";

interface ResetSettingsProps extends SettingsSectionProps {
  onResetAll: () => void;
}

export function ResetSettings({ language, onResetAll }: ResetSettingsProps) {
  const handleReset = () => {
    const confirmMessage = t(
      language,
      "모든 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      "Are you sure you want to reset all settings? This action cannot be undone."
    );

    if (window.confirm(confirmMessage)) {
      onResetAll();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {t(language, "초기화", "Reset Settings")}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-button">
          <h3 className="text-sm font-bold text-red-700 dark:text-red-300 mb-2">
            ⚠️ {t(language, "주의", "Warning")}
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400">
            {t(
              language,
              "이 작업은 모든 설정을 기본값으로 되돌립니다. 창 위치, 테마, 폰트 크기 등 모든 사용자 설정이 초기화됩니다.",
              "This action will reset all settings to their default values. All user preferences including window positions, theme, font size, etc. will be reset."
            )}
          </p>
        </div>

        <Button variant="destructive" onClick={handleReset}>
          <RotateCcw size={16} />
          {t(language, "모든 설정 초기화", "Reset All Settings")}
        </Button>
      </div>
    </div>
  );
}
