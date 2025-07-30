/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
   extend: {
      colors: {
        50: "#e3f2ff",
      100: "#b3daff",
      200: "#81c0ff",
      300: "#4ea6ff",
      400: "#1b8cff",
      500: "#006ddb",
      600: "#0051aa",
      700: "#003778",
      800: "#001c47",
      900: "#000318",
      },
    },
  },
  plugins: [],
};
