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
    default: "SilentCut Studio - Remove Pauses & Dead Air from Audio Instantly",
    template: "%s | SilentCut Studio",
  },
  description: "Remove pauses, dead air, and awkward silences from any audio file in seconds. Perfect for podcasters, YouTubers, AI voice users, and content creators. 100% free, browser-based, privacy-first.",
  keywords: [
    // General audio editing
    "remove pauses from audio",
    "remove dead air from audio",
    "remove silence from audio",
    "audio silence remover",
    "audio pause remover",
    "cut silences from audio",
    "audio trimmer online",
    "free audio editor",

    // Podcasting
    "podcast audio cleanup",
    "remove pauses from podcast",
    "podcast editing tool",
    "podcast silence remover",
    "clean up podcast audio",

    // Content creators
    "youtube audio cleanup",
    "remove dead air youtube",
    "voiceover editing tool",
    "content creator audio tool",
    "audiobook editing",

    // AI voice specific
    "remove pauses from elevenlabs",
    "fix elevenlabs pause issues",
    "ai voice cleanup",
    "remove pauses from ai voice",
    "elevenlabs post-processing",
    "text to speech pause removal",
    "synthetic voice cleanup",

    // Technical
    "browser audio editor",
    "online audio editor free",
    "waveform editor",
    "client-side audio processing"
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
    title: "SilentCut Studio - Remove Pauses & Dead Air from Audio Instantly",
    description: "Remove pauses from podcasts, YouTube videos, AI voices, and more. Free, browser-based, privacy-first audio editor.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SilentCut Studio - Remove Pauses from Audio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SilentCut Studio - Remove Pauses from Audio Instantly",
    description: "Remove dead air from podcasts, YouTube, AI voices. Free & browser-based.",
    images: ["/og-image.png"],
    creator: "@silentcutstudio",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
  classification: "Audio Editor",
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
