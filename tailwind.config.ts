import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0D2B21",
          light: "#163A2D",
          dark: "#071A14",
        },
        gold: {
          DEFAULT: "#FACC15",
          light: "#FDE047",
          dark: "#F59E0B",
        },
        emerald: {
          DEFAULT: "#22C55E",
          light: "#4ADE80",
          dark: "#16A34A",
        },
        sage: {
          DEFAULT: "#86A98F",
        },
        ink: {
          DEFAULT: "#E8F5E9",
          muted: "#A7B8AE",
        },
        surface: {
          DEFAULT: "#0A2118",
          card: "#0F2A20",
          muted: "#1F4A38",
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "cell-grid":
          "linear-gradient(rgba(250,204,21,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        cell: "28px 28px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "rise-fade": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        ticker: "ticker 28s linear infinite",
        "rise-fade": "rise-fade 0.6s ease-out both",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
