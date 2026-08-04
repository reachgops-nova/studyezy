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
      },
    },
  },
  plugins: [],
};

export default config;
