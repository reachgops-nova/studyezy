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
        // Bricolage Grotesque for headings/brand - a contemporary display
        // face with real character (distinct terminals, not another
        // rounded-bubble kids'-app font) - paired with Manrope for body
        // copy, a warm-neutral grotesque that stays legible at chat-message
        // length. Both self-hosted via next/font in app/layout.tsx.
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        // One quiet shadow token used on every card app-wide - lower
        // elevation and lower opacity than the old set, ink-tinted rather
        // than pure black, on purpose: the old shadow read as "heavy" at
        // the density this app actually uses cards.
        soft: "0 1px 2px rgba(22,36,31,0.03), 0 6px 16px -8px rgba(22,36,31,0.10)",
        "soft-lg": "0 2px 4px rgba(22,36,31,0.04), 0 12px 28px -10px rgba(22,36,31,0.14)",
      },
      colors: {
        // Practice (calm, ink) vs test (warm, rust) stay visually distinct
        // on purpose - a kid should always know which mode they're in.
        practice: {
          bg: "#eef2ef",
          border: "#d7e2dc",
          accent: "#1f3a32",
        },
        test: {
          bg: "#fbeee6",
          border: "#eec7ac",
          accent: "#a1441f",
        },
        // Brand palette: deep forest-ink for primary actions/wordmark
        // (replaces the old bright navy), a cool sage-white page ground
        // (replaces the peachy cream + gradient), and one deliberate gold
        // accent standing in for the old orange - fewer competing hues.
        brand: {
          ink: "#16241f",
          "ink-dark": "#0e1712",
          "ink-light": "#3c5049",
          paper: "#f4f6f1",
          gold: "#9c6f1f",
          "gold-bright": "#c99a2e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
