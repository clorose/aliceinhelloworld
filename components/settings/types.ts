/**
 * Settings Section Types
 * Shared types for settings components
 */

export type Language = "ko" | "en";

export interface SettingsSectionProps {
  language: Language;
}

/**
 * Get localized text based on language
 */
export function t(language: Language, ko: string, en: string): string {
  return language === "ko" ? ko : en;
}
