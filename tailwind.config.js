/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trading-dark': '#0a0e1a',
        'trading-blue': '#1e3a8a',
        'trading-green': '#10b981',
        'trading-red': '#ef4444',
        'trading-gray': '#374151',
      },
      animation: {
        'pulse-green': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-red': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}