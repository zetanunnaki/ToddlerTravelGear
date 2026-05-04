import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ToddlerTravelGear — Travel Lighter. Worry Less.",
    template: "%s | ToddlerTravelGear",
  },
  description:
    "Honest, safety-first gear recommendations for parents traveling with babies and toddlers. Strollers, car seats, travel cribs, and more.",
  metadataBase: new URL("https://toddlertravelgear.com"),
  alternates: { canonical: "/" },
  keywords: [
    "travel stroller",
    "toddler travel gear",
    "FAA approved car seat",
    "travel crib",
    "baby travel essentials",
    "flying with toddler",
    "traveling with baby",
    "toddler packing list",
    "portable high chair",
    "baby carrier for travel",
  ],
  openGraph: {
    siteName: "ToddlerTravelGear",
    type: "website",
    locale: "en_US",
    title: "ToddlerTravelGear — Travel Lighter. Worry Less.",
    description:
      "Thoroughly researched gear reviews, FAA-approved car seat guides, and packing lists for parents traveling with babies & toddlers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToddlerTravelGear — Travel Lighter. Worry Less.",
    description:
      "Thoroughly researched gear reviews, FAA-approved car seat guides, and packing lists for parents traveling with babies & toddlers.",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Analytics />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
