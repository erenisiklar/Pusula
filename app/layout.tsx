import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pusula — Avrupa Üniversite Rehberi",
  description:
    "Türkiye'den Avrupa üniversitelerine başvurmak isteyen öğrenciler için AI destekli rehber platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
