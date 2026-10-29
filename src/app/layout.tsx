import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charity Ledger System",
  description: "Dev environment for Charity Ledger MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

