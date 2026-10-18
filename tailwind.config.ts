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
        primary: "#1a3c34",
        accent: "#c9a84c",
        "accent-ink": "#8a6d24",
        background: "#f6f5f2",
        "text-main": "#141414",
        "text-secondary": "#6b6b66",
        line: "#e9e7e2",
        card: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,20,20,0.04), 0 8px 24px -12px rgba(20,20,20,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
