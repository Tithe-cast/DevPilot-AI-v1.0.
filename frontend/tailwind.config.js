/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#06b6d4', // Neon Cyan
          secondary: '#6366f1', // Royal Violet/Indigo
          accent: '#10b981', // Emerald Green
        },
        neutral: {
          darkBg: '#090d16', // Ultra dark blue-gray
          cardBg: '#131926', // Premium dark gray
          border: '#1f293d', // Subtle border color
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
