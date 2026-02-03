/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-gray-50',
    'border-gray-300',
    'bg-red-50',
    'border-red-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}