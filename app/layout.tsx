import type { Metadata } from "next";
import "./globals.css";
import { AppChrome } from "@/components/app-chrome";

export const metadata: Metadata = {
  title: { default: "Displyfy | Creator performance marketplace", template: "%s | Displyfy" },
  description: "Natural product placement campaigns for Instagram creators and performance-minded brands.",
  icons: { icon: "/brand/displyfy-mark-v3.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
