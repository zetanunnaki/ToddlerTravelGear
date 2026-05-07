import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { CompareProvider } from "@/components/CompareContext";
import { CompareBar } from "@/components/CompareBar";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8VYBLPMPFJ" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-8VYBLPMPFJ');
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})();
        `}} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-navy-900 text-gray-900 dark:text-gray-200">
        <ThemeProvider>
          <Analytics />
          <CompareProvider>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <CompareBar />
          </CompareProvider>
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
