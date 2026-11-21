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
        brand: {
          50: "#f0f4ff",
          100: "#dbe4fe",
          200: "#bfd0fd",
          300: "#93b2fb",
          400: "#608bf6",
          500: "#3b64ee",
          600: "#2446e2",
          700: "#1d34cd",
          800: "#1d2ca5",
          900: "#1c2a82",
          950: "#11184f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
