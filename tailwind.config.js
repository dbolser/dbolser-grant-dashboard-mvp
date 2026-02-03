/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'critical': '#10b981',
        'high': '#3b82f6',
        'moderate': '#f59e0b',
        'low': '#ef4444',
      },
    },
  },
  plugins: [],
}
