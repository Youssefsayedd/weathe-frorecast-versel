/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        navy: '#001f3f', // Navy blue
        darkBlue: '#000080', // Dark blue shade
      },
    },
  },
  plugins: [],
};
