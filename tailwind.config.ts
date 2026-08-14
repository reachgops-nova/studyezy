import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        practice: {
          bg: "#eef6ff",
          border: "#bfdbfe",
          accent: "#2563eb",
        },
        test: {
          bg: "#fff7ed",
          border: "#fed7aa",
          accent: "#c2410c",
        },
        // Brand palette: navy for primary actions/wordmark, warm cream for
        // page backgrounds, paired with the existing orange-500/600 mascot
        // accent (unchanged).
        brand: {
          navy: "#1e2a4a",
          "navy-dark": "#152036",
          "navy-light": "#334368",
          cream: "#faf6ee",
        },
      },
    },
  },
  plugins: [],
};

export default config;
