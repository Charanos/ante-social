import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Mona Sans is loaded via CSS import in globals.css
// Using Outfit as a Google Fonts alternative similar to Mona Sans
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

// JetBrains Mono for numeric displays
import { JetBrains_Mono } from "next/font/google";
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ante Social",
  description: "Ante Social - Social Casino Platform for the Kenyan Market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${jetbrainsMono.variable} ${outfit.className} bg-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
