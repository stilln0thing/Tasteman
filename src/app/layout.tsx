import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tasteman Dry Fruits and Spices",
  description: "Premium dry fruits, spices, and nuts for homes and businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-spice-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
