import type { Metadata } from "next";
import { Style_Script } from "next/font/google";
import "./globals.css";

const styleScript = Style_Script({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogiTrace — Boolean Logic Assistant",
  description:
    "LogiTrace helps you simplify Boolean expressions, generate Truth Tables, PDNF, and PCNF instantly. Perfect for students, engineers, and logic enthusiasts.",
  keywords: [
    "Boolean logic",
    "truth table generator",
    "boolean simplifier",
    "PDNF calculator",
    "PCNF calculator",
    "logic simplification",
    "digital logic",
    "boolean algebra",
    "logic expression tool",
  ],
  authors: [{ name: "LogiTrace" }],
  creator: "LogiTrace",
  publisher: "LogiTrace",
  metadataBase: new URL("https://logitrace.chirayusahu.com"), // change to your actual domain
  alternates: {
    canonical: "https://logitrace.chirayusahu.com",
  },
  openGraph: {
    title: "LogiTrace — Simplify Boolean Logic & Generate Truth Tables",
    description:
      "A fast and intuitive Boolean Logic Assistant that generates truth tables, PDNF, and PCNF expressions, and simplifies logical formulas.",
    url: "https://logitrace.com",
    siteName: "LogiTrace",
    images: [
      {
        url: "/og-image.png", // ideally 1200x630
        width: 1200,
        height: 630,
        alt: "LogiTrace — Boolean Logic Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogiTrace — Boolean Logic Assistant",
    description:
      "Generate Truth Tables, PDNF, PCNF, and simplify Boolean expressions instantly with LogiTrace.",
    images: ["/og-image.png"],
    creator: "@logitrace_app", // optional — change to your Twitter/X handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#2563eb", // Tailwind blue-600
  category: "tools",
  applicationName: "LogiTrace",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${styleScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
