import type { Metadata } from "next";
import { Bricolage_Grotesque, Fredoka, Kalam, Manrope } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font (built at compile time, no runtime CDN request)
// - Bricolage Grotesque for headings/brand (a display face with real
// character - distinct terminals and ink traps - instead of the previous
// bubble-rounded, toy-app feel), Manrope for body copy (warm-neutral
// grotesque, reads well at chat-message length). Replaces the generic
// Tailwind default sans stack app-wide.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Fredoka is scoped to the lesson board only (font-board), not the app. The
// reference the user shared uses it, and a rounded face is a real part of why
// that page reads as a children's product - but the rest of the app has
// deliberately moved away from "bubble-rounded, toy-app feel", so this does
// not become the app-wide sans.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-board",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

// Scoped to worked-example "chalkboard" reveals on the Learning Board only -
// real user direction 2026-09-22: make a worked formula "more attention
// seeking" by showing it like a teacher chalking it on a board, not another
// line of body text.
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-chalk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyEzy",
  description: "A voice-first, student-first learning companion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${fredoka.variable} ${manrope.variable} ${kalam.variable}`}>
      <body className="min-h-screen font-sans">
        {/* No max-width here on purpose - the sidebar app shell (AppShell)
            and the narrower single-column pages (auth, landing, focused
            lesson/test screens) each set their own width instead of
            fighting a global one. */}
        <div className="px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
