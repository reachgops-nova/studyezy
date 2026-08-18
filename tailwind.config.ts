import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        // Fredoka for headings/brand (rounded, friendly - matches the
        // kangaroo mascot's warmth) and Nunito for body copy (still warm,
        // but reads easily at length) - both loaded via next/font in
        // app/layout.tsx, exposed here as CSS variables so every Tailwind
        // class (font-display / default font-sans) resolves to the same
        // self-hosted files instead of a generic system stack.
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        // One soft, warm shadow token used on every card app-wide instead of
        // ad hoc shadow values - low elevation, navy-tinted rather than pure
        // black so it reads as "soft" rather than "heavy."
        soft: "0 1px 2px rgba(30,42,74,0.04), 0 8px 24px -8px rgba(30,42,74,0.12)",
        "soft-lg": "0 2px 4px rgba(30,42,74,0.05), 0 16px 40px -12px rgba(30,42,74,0.16)",
      },
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
