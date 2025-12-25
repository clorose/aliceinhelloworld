import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type Language = "ko" | "en";

interface SettingsState {
  // Appearance
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Fonts
  fontSize: number;
  setFontSize: (size: number) => void;

  // Animations
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // General
  windowDefaultWidth: number;
  windowDefaultHeight: number;
  setWindowDefaultSize: (width: number, height: number) => void;

  autoSave: boolean;
  setAutoSave: (enabled: boolean) => void;

  // Reset
  resetAllSettings: () => void;
}

const DEFAULT_SETTINGS = {
  theme: "system" as Theme,
  fontSize: 14,
  animationsEnabled: true,
  language: "ko" as Language,
  windowDefaultWidth: 800,
  windowDefaultHeight: 600,
  autoSave: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      ...DEFAULT_SETTINGS,

      // Actions
      // Note: Theme DOM manipulation is handled by next-themes (ThemeProvider)
      // We only store the preference here for persistence
      setTheme: (theme) => {
        set({ theme });
        // DOM manipulation removed - next-themes handles this via ThemeProvider
      },

      setFontSize: (fontSize) => {
        set({ fontSize });
        // Apply font size to document root
        document.documentElement.style.setProperty(
          "--font-size-base",
          `${fontSize}px`
        );
      },

      setAnimationsEnabled: (animationsEnabled) => {
        set({ animationsEnabled });
        // Apply reduced motion preference
        if (!animationsEnabled) {
          document.documentElement.style.setProperty(
            "--motion-reduce",
            "reduce"
          );
        } else {
          document.documentElement.style.setProperty("--motion-reduce", "");
        }
      },

      setLanguage: (language) => set({ language }),

      setWindowDefaultSize: (windowDefaultWidth, windowDefaultHeight) =>
        set({ windowDefaultWidth, windowDefaultHeight }),

      setAutoSave: (autoSave) => set({ autoSave }),

      resetAllSettings: () => {
        set(DEFAULT_SETTINGS);
        // Theme reset is handled by next-themes
        // Reset font size
        document.documentElement.style.setProperty(
          "--font-size-base",
          `${DEFAULT_SETTINGS.fontSize}px`
        );
        // Reset animations
        document.documentElement.style.setProperty("--motion-reduce", "");
      },
    }),
    {
      name: "aliceos-settings",
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        animationsEnabled: state.animationsEnabled,
        language: state.language,
        windowDefaultWidth: state.windowDefaultWidth,
        windowDefaultHeight: state.windowDefaultHeight,
        autoSave: state.autoSave,
      }),
    }
  )
);
