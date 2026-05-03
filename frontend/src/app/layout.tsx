import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://pageinsights.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "PageInsights — Free Web Performance & SEO Analyzer",
    template: "%s | PageInsights",
  },
  description:
    "Analyze any webpage's SEO, performance, accessibility, and best practices in seconds. Powered by Google PageSpeed Insights API v5 with AI-powered fix suggestions.",
  keywords: [
    "page speed test",
    "website performance analyzer",
    "SEO audit tool",
    "PageSpeed Insights",
    "Core Web Vitals checker",
    "LCP FCP CLS TBT",
    "web accessibility audit",
    "Lighthouse report",
    "free SEO tool",
    "website speed test",
    "PageInsights",
  ],
  authors: [{ name: "PageInsights" }],
  creator: "PageInsights",
  publisher: "PageInsights",
  category: "Technology",

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

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "PageInsights",
    title: "PageInsights — Free Web Performance & SEO Analyzer",
    description:
      "Instantly analyze any webpage for SEO, performance, accessibility, and best practices. Get AI-powered fix suggestions powered by Google PageSpeed Insights API.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PageInsights — Web Performance & SEO Analyzer",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PageInsights — Free Web Performance & SEO Analyzer",
    description:
      "Analyze any webpage's SEO, performance, and Core Web Vitals in seconds. Powered by Google PageSpeed Insights API v5.",
    images: ["/og-image.png"],
    creator: "@pageinsights",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  verification: {
    // google: "your-google-site-verification-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PageInsights",
  url: BASE_URL,
  description:
    "Free web performance and SEO analyzer. Instantly audit Core Web Vitals, accessibility, and best practices using Google PageSpeed Insights API v5.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "SEO audit",
    "Performance analysis",
    "Core Web Vitals (LCP, FCP, CLS, TBT)",
    "Accessibility audit",
    "Best practices report",
    "AI-powered fix suggestions",
    "Mobile & Desktop analysis",
    "Filmstrip timeline",
  ],
  author: {
    "@type": "Organization",
    name: "PageInsights",
    url: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="json-ld-webapp"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
