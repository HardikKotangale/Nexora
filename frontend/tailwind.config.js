/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0c10',
        surface: '#111318',
        surface2: '#181b22',
        border: '#1e2230',
        accent: '#00e5c5',
        accent2: '#7b5cfa',
        accent3: '#ff6b6b',
        accent4: '#f7c948',
        text: '#e8eaf0',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
