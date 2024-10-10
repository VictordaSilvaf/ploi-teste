/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      // Extenda o tema aqui, por exemplo:
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        app: {
          primary: "#9FC131",
          secondary: "#1F2937",
          tertiary: "#D9D9D9",
          quaternary: "#C4C4C4",
          quinary: "#A3A3A3",
          text: {
            primary: "#1F2937",
            secondary: "#6A7280",
            tertiary: "#9CA3AF",
            quaternary: "#D1D5DB",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
