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
        // Practice (calm, navy) vs test (warm, orange) stay visually
        // distinct on purpose - a kid should always know which mode they're
        // in - but both now read as part of the same navy/orange/cream
        // brand instead of practice defaulting to generic blue.
        practice: {
          bg: "#f3f5fa",
          border: "#dbe1ee",
          accent: "#1e2a4a",
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
