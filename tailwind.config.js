// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'rental-hero': "url('../public/background.png')",
        'rental-hero2': "url('../public/background2.png')",
      },
    },
  },
  plugins: [],
}