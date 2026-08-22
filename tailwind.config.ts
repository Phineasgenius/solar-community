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
        // Primary green palette
        navy: {
          DEFAULT: "#1E8E3E",
          light: "#E6F4EA",
          dark: "#137333",
        },

        // Accent / highlight
        gold: {
          DEFAULT: "#E37400",
          light: "#F9AB00",
          dark: "#C45D00",
        },

        // Main green
        emerald: {
          DEFAULT: "#1E8E3E",
          light: "#34A853",
          dark: "#137333",
        },

        // Soft natural green
        sage: {
          DEFAULT: "#81A684",
        },

        // Text
        ink: {
          DEFAULT: "#202124",
          muted: "#5F6368",
        },

        // Light surfaces
        surface: {
          DEFAULT: "#FFFFFF",
          card: "#F8F9FA",
          muted: "#F1F3F4",
        },

        // Additional palette colors
        blue: {
          DEFAULT: "#1A73E8",
          light: "#E8F0FE",
          dark: "#174EA6",
        },

        border: {
          DEFAULT: "#DADCE0",
          tech: "#E0E0E0",
        },
      },

      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      backgroundImage: {
        "cell-grid":
          "linear-gradient(rgba(30,142,62,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,142,62,0.08) 1px, transparent 1px)",
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
          "0%": {
            opacity: "0",
            transform: "translateY(14px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
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