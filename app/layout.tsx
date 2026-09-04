import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/app-chrome";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: { default: "Displyfy | Creator performance marketplace", template: "%s | Displyfy" },
  description: "Natural product placement campaigns for Instagram creators and performance-minded brands.",
  icons: { icon: "/brand/displyfy-mark-v3.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
