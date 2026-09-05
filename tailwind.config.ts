import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F1F38",
          50: "#EEF1F6",
          100: "#D6DCE8",
          200: "#AEB9D0",
          300: "#8595B7",
          400: "#5C719E",
          500: "#3D5280",
          600: "#233A63",
          700: "#16304F",
          800: "#0F1F38",
          900: "#091326",
          950: "#050B16",
        },
        gold: {
          DEFAULT: "#B8935A",
          50: "#FAF6EF",
          100: "#F1E5D0",
          200: "#E2C99E",
          300: "#D3AD6C",
          400: "#C4A046",
          500: "#B8935A",
          600: "#96723C",
          700: "#755730",
          800: "#543E23",
          900: "#332617",
        },
        ivory: "#F6F4EE",
        stone: {
          50: "#F6F4EE",
          100: "#EDE9DF",
          200: "#DCD5C4",
          600: "#5B5849",
          700: "#403E33",
        },
        ink: "#1C232E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      borderRadius: {
        sm: "4px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 31, 56, 0.06), 0 1px 0 rgba(15,31,56,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
