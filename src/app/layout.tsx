import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PC Builder",
  description: "Next.js + TS + Tailwind v4 scaffold",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-dvh bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}