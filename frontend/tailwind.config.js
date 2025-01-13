/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}", // Scan all your React files for Tailwind classes
  ],
  darkMode: 'class',
  theme: {
      extend: {
        colors: {
          'custom-yellow': '#c3d404',
          'custom-blue': '#04527a',
          'custom-light-blue': '#b0cbd4',
          'custom-dark-blue': '#407c9c',
          'custom-gray-blue': '#78a8bc',
          'custom-mid-blue': '#346e8e',
          'custom-deep-blue': '#043261',
          'custom-blue-gray': '#2c7494',
          'custom-teal': '#216c8c',
        },
      }, 
  },
  plugins: [],
};