import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Traffic light colors (macOS style)
        traffic: {
          red: {
            DEFAULT: 'rgb(239 68 68)', // red-500
            hover: 'rgb(220 38 38)', // red-600
          },
          yellow: {
            DEFAULT: 'rgb(234 179 8)', // yellow-500
            hover: 'rgb(202 138 4)', // yellow-600
          },
          green: {
            DEFAULT: 'rgb(34 197 94)', // green-500
            hover: 'rgb(22 163 74)', // green-600
          },
        },
        // Design system colors
        surface: {
          primary: 'rgb(255 255 255)',
          secondary: 'rgb(243 244 246)', // gray-100
          hover: 'rgb(229 231 235)', // gray-200
        },
        'surface-dark': {
          primary: 'rgb(24 24 27)', // zinc-900
          secondary: 'rgb(39 39 42)', // zinc-800
          hover: 'rgb(63 63 70)', // zinc-700
        },
        text: {
          primary: 'rgb(17 24 39)', // gray-900
          secondary: 'rgb(75 85 99)', // gray-600
        },
        'text-primary-dark': 'rgb(243 244 246)', // gray-100
        'text-secondary-dark': 'rgb(156 163 175)', // gray-400
        border: 'rgb(209 213 219)', // gray-300
        'border-dark': 'rgb(63 63 70)', // zinc-700
        accent: {
          DEFAULT: 'rgb(59 130 246)', // blue-500
          dark: 'rgb(96 165 250)', // blue-400
        },
        'accent-dark': 'rgb(96 165 250)', // blue-400
      },
      spacing: {
        'menubar': '32px',
        'sidebar': '220px',
        'dock': '64px',
      },
      zIndex: {
        '200': '200',
        '300': '300',
      },
      borderRadius: {
        'window': '8px',
        'card': '6px',
        'button': '6px',
      },
      boxShadow: {
        'window': '0 10px 40px rgba(0, 0, 0, 0.2)',
        'window-active': '0 15px 50px rgba(0, 0, 0, 0.3)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'window-open': 'window-open 0.2s ease-out',
        'window-close': 'window-close 0.2s ease-in',
      },
      keyframes: {
        'window-open': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'window-close': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
