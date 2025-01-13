/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // Scan all your React files for Tailwind classes
  ],
  darkMode: 'class',
  theme: {
      extend: {}, 
  },
  plugins: [],
};