/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}", // Includes all common file types
  ],
  theme: {
    extend: {
      fontFamily: {
        ougkeh: ['Ougkeh', 'sans-serif'], // Add the custom font
      },
    },
  },
  plugins: [],
};
