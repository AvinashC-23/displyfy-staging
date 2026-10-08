import type { Metadata } from "next";
import { Anton, Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/app-chrome";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Displyfy | Creator performance marketplace", template: "%s | Displyfy" },
  description: "Natural product placement campaigns for Instagram creators and performance-minded brands.",
  icons: { icon: "/brand/displyfy-mark-v3.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${anton.variable} ${instrumentSerif.variable}`} data-scroll-behavior="smooth">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
