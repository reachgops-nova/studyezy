import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyEzy",
  description: "A voice-first, student-first learning companion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
