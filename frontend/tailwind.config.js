/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6C28D9",
          dark: "#5620B0",
          light: "#F2ECFC",
        },
        ink: "#16121F",
        muted: "#6F6B7A",
        surface: "#FAF9FC",
        line: "#E9E5F2",
        success: "#1E9E6B",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22, 18, 31, 0.04), 0 8px 24px rgba(22, 18, 31, 0.06)",
      },
    },
  },
  plugins: [],
};
