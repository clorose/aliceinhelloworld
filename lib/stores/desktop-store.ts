import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export type WindowId = string;

export interface DesktopWindow {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  // Store pre-maximized state for restoration
  preMaximizedPosition?: { x: number; y: number };
  preMaximizedSize?: { width: number; height: number };
}

// Serializable window state (without React components)
export interface WindowState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  preMaximizedPosition?: { x: number; y: number };
  preMaximizedSize?: { width: number; height: number };
  minimizedAt?: number; // Timestamp when window was minimized
}

interface DesktopState {
  windows: DesktopWindow[];
  activeWindowId: WindowId | null;
  missionControlOpen: boolean;
  showDesktop: boolean;
  nextZIndex: number; // Track next z-index to prevent overflow

  // Persisted window states (position, size, etc.)
  windowStates: Record<WindowId, WindowState>;

  // Dock State
  dockOpen: boolean; // Toggle Dock visibility

  // Toast (using sonner)
  showToast: (message: string, type?: "error" | "info") => void;

  // Actions
  openWindow: (window: Omit<DesktopWindow, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMaximize: (id: WindowId) => void;
  bringToFront: (id: WindowId) => void;
  updateWindowSize: (id: WindowId, size: { width: number; height: number }) => void;
  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => void;
  toggleMissionControl: () => void;
  setMissionControl: (isOpen: boolean) => void;
  toggleShowDesktop: () => void;
  resetWindowStates: () => void; // Clear saved states
  resetAllWindows: () => void; // Close all windows and clear states

  // Dock Actions
  toggleDock: () => void;
  setDock: (isOpen: boolean) => void;
}

const BASE_Z_INDEX = 100;
const MAX_Z_INDEX = 10000;

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set, get) => ({
      windows: [],
      activeWindowId: null,
      missionControlOpen: false,
      showDesktop: false,
      nextZIndex: BASE_Z_INDEX,
      windowStates: {},
      dockOpen: true, // Show Dock by default

      showToast: (message, type = "info") => {
        if (type === "error") {
          toast.error(message);
        } else {
          toast.info(message);
        }
      },

  openWindow: (newWindow: Omit<DesktopWindow, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => {
    const { windows, showToast, nextZIndex, windowStates } = get();
    const existingWindow = windows.find((w) => w.id === newWindow.id);

    if (existingWindow) {
      // If window exists, just open it and bring to front
      // Also update content/title/icon in case they changed (e.g. refreshed props)
      const newZIndex = nextZIndex >= MAX_Z_INDEX ? BASE_Z_INDEX : nextZIndex;
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === newWindow.id
            ? {
                ...w,
                ...newWindow, // Update properties
                isOpen: true,
                isMinimized: false,
                zIndex: newZIndex,
              }
            : w
        ),
        activeWindowId: newWindow.id,
        showDesktop: false,
        missionControlOpen: false,
        nextZIndex: newZIndex + 1,
      }));
    } else {
      // Check Limit for Post Windows
      // "Limit to a total of 5 windows (counting only Post windows separately)"
      // We identify post windows by ID pattern "post-*"
      if (newWindow.id.startsWith("post-")) {
        const postWindowCount = windows.filter(w => w.id.startsWith("post-")).length;
        if (postWindowCount >= 5) {
          showToast("Too many windows! Max 5 posts allowed.", "error");
          return; // Block opening
        }
      }

      // Create new window with default position/size if not provided
      const newZIndex = nextZIndex >= MAX_Z_INDEX ? BASE_Z_INDEX : nextZIndex;

      // Check if we have saved state for this window
      const savedState = windowStates[newWindow.id];

      // If no saved state, generate random position within safe bounds
      const defaultSize = newWindow.size || { width: 800, height: 600 };

      // Calculate safe random position (keep window fully visible with margin)
      const MENU_BAR_HEIGHT = 32;
      const DOCK_HEIGHT = 80;
      const MARGIN = 50; // Safety margin from edges

      const maxX = Math.max(MARGIN, globalThis.window.innerWidth - defaultSize.width - MARGIN);
      const maxY = Math.max(MENU_BAR_HEIGHT + MARGIN, globalThis.window.innerHeight - defaultSize.height - DOCK_HEIGHT - MARGIN);

      const randomX = Math.floor(MARGIN + Math.random() * Math.max(0, maxX - MARGIN));
      const randomY = Math.floor(MENU_BAR_HEIGHT + MARGIN + Math.random() * Math.max(0, maxY - MENU_BAR_HEIGHT - MARGIN));

      const initialState: WindowState = savedState || {
        position: newWindow.position || { x: randomX, y: randomY },
        size: defaultSize,
        isMinimized: false,
        isMaximized: false,
      };

      set((state) => ({
        windows: [
          ...state.windows,
          {
            ...newWindow,
            isOpen: true,
            isMinimized: initialState.isMinimized,
            isMaximized: initialState.isMaximized,
            zIndex: newZIndex,
            position: initialState.position,
            size: initialState.size,
            preMaximizedPosition: initialState.preMaximizedPosition,
            preMaximizedSize: initialState.preMaximizedSize,
          },
        ],
        activeWindowId: newWindow.id,
        showDesktop: false,
        missionControlOpen: false,
        nextZIndex: newZIndex + 1,
      }));
    }
  },

  closeWindow: (id: WindowId) => {
    set((state) => {
      // Save window state before closing
      const closingWindow = state.windows.find((w) => w.id === id);
      if (closingWindow) {
        return {
          windows: state.windows.filter((w) => w.id !== id),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
          windowStates: {
            ...state.windowStates,
            [id]: {
              position: closingWindow.position || { x: 100, y: 100 },
              size: closingWindow.size || { width: 800, height: 600 },
              isMinimized: closingWindow.isMinimized,
              isMaximized: closingWindow.isMaximized,
              preMaximizedPosition: closingWindow.preMaximizedPosition,
              preMaximizedSize: closingWindow.preMaximizedSize,
            },
          },
        };
      }
      return {
        windows: state.windows.filter((w) => w.id !== id),
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      };
    });
  },

  minimizeWindow: (id: WindowId) => {
    set((state) => {
      const updatedWindows = state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      );
      const minimizedWindow = updatedWindows.find((w) => w.id === id);
      return {
        windows: updatedWindows,
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        windowStates: minimizedWindow
          ? {
              ...state.windowStates,
              [id]: {
                position: minimizedWindow.position || { x: 100, y: 100 },
                size: minimizedWindow.size || { width: 800, height: 600 },
                isMinimized: true,
                isMaximized: minimizedWindow.isMaximized,
                preMaximizedPosition: minimizedWindow.preMaximizedPosition,
                preMaximizedSize: minimizedWindow.preMaximizedSize,
                minimizedAt: Date.now(),
              },
            }
          : state.windowStates,
      };
    });
  },

  bringToFront: (id: WindowId) => {
    set((state) => {
      const newZIndex = state.nextZIndex >= MAX_Z_INDEX ? BASE_Z_INDEX : state.nextZIndex;
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w
        ),
        activeWindowId: id,
        showDesktop: false,
        nextZIndex: newZIndex + 1,
      };
    });
  },

  toggleMaximize: (id: WindowId) => {
    set((state) => {
      const updatedWindows = state.windows.map((w) => {
        if (w.id !== id) return w;

        if (w.isMaximized) {
          // Restore to previous size/position
          return {
            ...w,
            isMaximized: false,
            position: w.preMaximizedPosition || w.position || { x: 100, y: 100 },
            size: w.preMaximizedSize || w.size || { width: 800, height: 600 },
          };
        } else {
          // Maximize - save current state and set to full screen (minus menu bar and optionally dock)
          // MenuBar: 32px, Dock: ~72px (64px height + 8px pb-2) - only when dock is open
          const MENU_BAR_HEIGHT = 32;
          const DOCK_HEIGHT = get().dockOpen ? 80 : 0; // Only subtract dock height if it's open
          return {
            ...w,
            isMaximized: true,
            preMaximizedPosition: w.position || { x: 100, y: 100 },
            preMaximizedSize: w.size || { width: 800, height: 600 },
            position: { x: 0, y: MENU_BAR_HEIGHT },
            size: {
              width: globalThis.window.innerWidth,
              height: globalThis.window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT
            },
          };
        }
      });
      const toggledWindow = updatedWindows.find((w) => w.id === id);
      return {
        windows: updatedWindows,
        windowStates: toggledWindow
          ? {
              ...state.windowStates,
              [id]: {
                position: toggledWindow.position || { x: 100, y: 100 },
                size: toggledWindow.size || { width: 800, height: 600 },
                isMinimized: toggledWindow.isMinimized,
                isMaximized: toggledWindow.isMaximized,
                preMaximizedPosition: toggledWindow.preMaximizedPosition,
                preMaximizedSize: toggledWindow.preMaximizedSize,
              },
            }
          : state.windowStates,
      };
    });
  },

  updateWindowSize: (id: WindowId, size: { width: number; height: number }) => {
    set((state) => {
      const updatedWindows = state.windows.map((w) =>
        w.id === id ? { ...w, size, isMaximized: false } : w
      );
      const resizedWindow = updatedWindows.find((w) => w.id === id);
      return {
        windows: updatedWindows,
        windowStates: resizedWindow
          ? {
              ...state.windowStates,
              [id]: {
                ...(state.windowStates[id] || {
                  position: { x: 100, y: 100 },
                  isMinimized: false,
                  isMaximized: false,
                }),
                size,
              },
            }
          : state.windowStates,
      };
    });
  },

  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => {
    set((state) => {
      const updatedWindows = state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      );
      const movedWindow = updatedWindows.find((w) => w.id === id);
      return {
        windows: updatedWindows,
        windowStates: movedWindow
          ? {
              ...state.windowStates,
              [id]: {
                ...(state.windowStates[id] || {
                  size: { width: 800, height: 600 },
                  isMinimized: false,
                  isMaximized: false,
                }),
                position,
              },
            }
          : state.windowStates,
      };
    });
  },

  toggleMissionControl: () => {
    set((state) => ({ missionControlOpen: !state.missionControlOpen }));
  },

  setMissionControl: (isOpen: boolean) => {
    set({ missionControlOpen: isOpen });
  },

  toggleShowDesktop: () => {
    set((state) => ({ showDesktop: !state.showDesktop }));
  },

  resetWindowStates: () => {
    set({ windowStates: {} });
  },

  resetAllWindows: () => {
    set({
      windows: [],
      activeWindowId: null,
      windowStates: {},
      nextZIndex: BASE_Z_INDEX,
      missionControlOpen: false,
      showDesktop: false,
    });
  },

  // Dock Actions
  toggleDock: () => {
    set((state) => ({ dockOpen: !state.dockOpen }));
  },

  setDock: (isOpen: boolean) => {
    set({ dockOpen: isOpen });
  },
}),
    {
      name: 'alice-desktop-storage',
      partialize: (state) => ({
        windowStates: state.windowStates,
      }),
    }
  )
);
