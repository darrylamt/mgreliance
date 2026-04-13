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
        background: "#f9f7f4",
        "text-main": "#1a1a1a",
        "text-secondary": "#6b7280",
        card: "#ffffff",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(26,60,52,0.7) 0%, rgba(26,60,52,0.4) 60%, rgba(26,60,52,0.7) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
