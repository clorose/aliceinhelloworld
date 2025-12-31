"use client";

import React from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { type SettingsSectionProps, type Language, t } from "./types";

interface LanguageSettingsProps extends SettingsSectionProps {
  setLanguage: (lang: Language) => void;
}

export function LanguageSettings({
  language,
  setLanguage,
}: LanguageSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {t(language, "언어 설정", "Language Settings")}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t(language, "언어", "Language")}
          </label>
          <Dropdown
            options={[
              { value: "ko", label: "한국어 (Korean)" },
              { value: "en", label: "English" },
            ]}
            value={language}
            onChange={(value) => setLanguage(value as Language)}
            size="sm"
          />
          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-1">
            {t(
              language,
              "AliceOS의 표시 언어를 설정합니다.",
              "Set the display language for AliceOS."
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LanguageButton
            langCode="ko"
            currentLang={language}
            onClick={() => setLanguage("ko")}
            flag="🇰🇷"
            label="한국어"
          />
          <LanguageButton
            langCode="en"
            currentLang={language}
            onClick={() => setLanguage("en")}
            flag="🇺🇸"
            label="English"
          />
        </div>
      </div>
    </div>
  );
}

interface LanguageButtonProps {
  langCode: Language;
  currentLang: Language;
  onClick: () => void;
  flag: string;
  label: string;
}

function LanguageButton({
  langCode,
  currentLang,
  onClick,
  flag,
  label,
}: LanguageButtonProps) {
  const isActive = langCode === currentLang;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-button border-2 transition-colors ${
        isActive
          ? "border-accent bg-accent/10 dark:border-accent-dark dark:bg-accent-dark/10"
          : "border-border dark:border-border-dark hover:border-accent dark:hover:border-accent-dark"
      }`}
    >
      <span className="text-2xl">{flag}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
