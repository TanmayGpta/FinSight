/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",              // ✅ since it’s outside src/
    "./src/**/*.{js,jsx,ts,tsx}" // ✅ for all React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
