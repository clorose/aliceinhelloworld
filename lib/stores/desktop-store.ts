import { create } from 'zustand';

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

interface DesktopState {
  windows: DesktopWindow[];
  activeWindowId: WindowId | null;
  missionControlOpen: boolean;
  showDesktop: boolean;

  // Toast State
  toast: { message: string; type: "error" | "info" } | null;
  showToast: (message: string, type?: "error" | "info") => void;
  hideToast: () => void;

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
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  missionControlOpen: false,
  showDesktop: false,
  toast: null,

  showToast: (message, type = "info") => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },
  hideToast: () => set({ toast: null }),

  openWindow: (newWindow: Omit<DesktopWindow, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => {
    const { windows, showToast } = get();
    const existingWindow = windows.find((w) => w.id === newWindow.id);

    if (existingWindow) {
      // If window exists, just open it and bring to front
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === newWindow.id ? { ...w, isOpen: true, isMinimized: false, zIndex: Math.max(...state.windows.map(w => w.zIndex), 0) + 1 } : w
        ),
        activeWindowId: newWindow.id,
        showDesktop: false,
        missionControlOpen: false,
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

      // Create new window
      set((state) => ({
        windows: [
          ...state.windows,
          {
            ...newWindow,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: Math.max(...state.windows.map(w => w.zIndex), 0) + 1,
          },
        ],
        activeWindowId: newWindow.id,
        showDesktop: false,
        missionControlOpen: false,
      }));
    }
  },

  closeWindow: (id: WindowId) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id: WindowId) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  bringToFront: (id: WindowId) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, zIndex: Math.max(...state.windows.map(w => w.zIndex), 0) + 1 }
          : w
      ),
      activeWindowId: id,
    }));
  },

  toggleMaximize: (id: WindowId) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;

        if (w.isMaximized) {
          // Restore to previous size/position
          return {
            ...w,
            isMaximized: false,
            position: w.preMaximizedPosition || w.position,
            size: w.preMaximizedSize || w.size,
          };
        } else {
          // Maximize - save current state and set to full screen (minus menu bar)
          return {
            ...w,
            isMaximized: true,
            preMaximizedPosition: w.position,
            preMaximizedSize: w.size,
            position: { x: 0, y: 32 }, // 32px for menu bar
            size: { width: globalThis.window.innerWidth, height: globalThis.window.innerHeight - 32 },
          };
        }
      }),
    }));
  },

  updateWindowSize: (id: WindowId, size: { width: number; height: number }) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size, isMaximized: false } : w
      ),
    }));
  },

  updateWindowPosition: (id: WindowId, position: { x: number; y: number }) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }));
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
}));
