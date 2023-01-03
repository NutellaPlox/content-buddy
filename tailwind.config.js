/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#fc9247",
        dark: "#151515",
        darker: "#111111",
        "gray-outline": "#777777",
      },
    },
  },
  plugins: [],
}
