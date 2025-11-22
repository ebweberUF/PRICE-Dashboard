import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRICE Dashboard",
  description: "UF PRICE Study Dashboard - HIPAA Compliant Research Data Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
