import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font (built at compile time, no runtime CDN request)
// - Fredoka for headings/brand (rounded, friendly, matches the kangaroo
// mascot's warmth), Nunito for body copy (still warm but reads easily at
// length). Replaces the generic Tailwind default sans stack app-wide.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyEzy",
  description: "A voice-first, student-first learning companion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
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
