import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff5f5",
          100: "#ffe1e1",
          200: "#ffc6c6",
          300: "#ff9d9d",
          400: "#ff6b6b",
          500: "#f23e3e",
          600: "#d92626",
          700: "#b11f1f",
          800: "#7f1d1d",
          900: "#5b1414",
        },
        ink: "#1f1a1a",
        sand: "#f7f1ed",
        fog: "#f0e7e2",
        pine: "#1f3a34",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "Manrope", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 50px -30px rgba(31, 26, 26, 0.35)",
        glow: "0 0 0 1px rgba(242, 62, 62, 0.2), 0 12px 30px rgba(242, 62, 62, 0.25)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at 15% 20%, rgba(242,62,62,0.20), transparent 55%), radial-gradient(circle at 80% 10%, rgba(31,58,52,0.18), transparent 45%), linear-gradient(120deg, #fff7f5 0%, #f7f1ed 50%, #f0e7e2 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
