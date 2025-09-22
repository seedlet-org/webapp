import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "../lib/providers";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seedlet - Grow Ideas Together",
  description:
    "Seedlet is a collaborative platform where ideas sprout into projects. Validate your ideas, invite collaborators, and build together in Labs.",
  keywords: [
    "idea validation",
    "collaborative platform",
    "startups",
    "early stage ideas",
    "Seedlet",
    "project management",
    "brainstorming",
    "side projects",
    "build in public",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
