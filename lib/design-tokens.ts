/**
 * Design Tokens
 *
 * Centralized design system utilities.
 * Uses standard Tailwind classes for consistency and compatibility.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to combine and merge Tailwind class names
 * Handles conditional classes and removes conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Layout constants
 */
export const layout = {
  menubar: { height: 32 },
  dock: { height: 80, minHeight: 64 },
  sidebar: { width: 220 },
} as const

/**
 * Default values for windows
 */
export const defaults = {
  window: {
    position: { x: 100, y: 100 },
    size: { width: 800, height: 600 },
  },
  animation: {
    spring: { stiffness: 300, damping: 30 },
  },
} as const

/**
 * Window ID patterns
 */
export const patterns = {
  postWindowId: (postId: string) => `post-${postId}`,
  isPostWindow: (windowId: string) => windowId.startsWith('post-'),
} as const

/**
 * Design system constants (legacy - for backward compatibility)
 * @deprecated Use layout.* instead
 */
export const spacing = {
  menubar: '32px',
  sidebar: '220px',
  dock: '64px',
} as const

export const typography = {
  heading: {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-semibold',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-semibold',
  },
  body: {
    large: 'text-base',
    medium: 'text-sm',
    small: 'text-xs',
  },
} as const

/**
 * Dock design tokens
 * Specific values for the macOS-style dock component
 */
export const dock = {
  height: '64px',
  iconSize: '48px',
  iconSizeHover: '58px', // maxScale: 1.2
  maxScale: 1.2, // 20% magnification for subtle effect
  effectRadius: 100, // Tighter effect area
  gap: '12px', // Increased spacing
  padding: '8px',
  transition: {
    spring: {
      stiffness: 300,
      damping: 20,
    },
  },
} as const
