import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          subtle: "#eff6ff",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f8fafc",
          hover: "#f1f5f9",
        },
        border: {
          DEFAULT: "#e5e7eb",
          light: "#f1f5f9",
          dark: "#d1d5db",
        },
        trend: {
          rising: "#16a34a",
          declining: "#dc2626",
          stable: "#64748b",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
