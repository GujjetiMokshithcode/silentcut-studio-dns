import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl = "https://silentcut.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Remove Pauses from ElevenLabs & AI Voices | SilentCut Studio",
    template: "%s | SilentCut Studio",
  },
  description: "Fix ElevenLabs pause issues instantly. Remove unnatural pauses from AI voice audio in seconds. Browser-based, privacy-first, 100% free to try.",
  keywords: [
    "remove pauses from elevenlabs",
    "fix elevenlabs pause issues",
    "elevenlabs audio sounds rushed",
    "ai voice cleanup",
    "synthetic voice post-processing",
    "remove pauses from ai voice",
    "clean elevenlabs audio",
    "fix ai voice pacing",
    "elevenlabs post-processing",
    "remove dead air from ai voice",
    "murf voice pause issues",
    "google tts pause problems",
    "microsoft azure voice cleanup",
    "text to speech pause removal",
    "ai voice post-processing tools",
    "make synthetic voices sound human"
  ],
  authors: [{ name: "SilentCut Studio", url: siteUrl }],
  creator: "SilentCut Studio",
  publisher: "SilentCut Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SilentCut Studio",
    title: "Remove Pauses from ElevenLabs & AI Voices | SilentCut Studio",
    description: "Fix ElevenLabs pause issues instantly. Remove unnatural pauses from AI voice audio.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SilentCut - Remove Pauses from AI Voice Audio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Pauses from ElevenLabs & AI Voices | SilentCut Studio",
    description: "Fix ElevenLabs pause issues instantly. Privacy-first, 100% free.",
    images: ["/og-image.png"],
    creator: "@silentcutstudio",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
  classification: "AI Voice Audio Editor",
  applicationName: "SilentCut Studio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
