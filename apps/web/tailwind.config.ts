import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0baf60", dark: "#008a49", deep: "#00512a", soft: "#e3f9ec", tint: "#f3fbf6" },
        ink: "#0f172a",
        mute: "#64748b",
        line: "#dcefe3",
      },
      fontFamily: { sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"], display: ["Plus Jakarta Sans", "Inter", "sans-serif"] },
      boxShadow: { card: "0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(0,81,42,.06)", glow: "0 8px 22px rgba(0,138,73,.3)" },
    },
  },
  plugins: [],
} satisfies Config;
