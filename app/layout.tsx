// app/layout.tsx
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/NavBar";
import { Footer } from "./components/sections/Footer";
import "./globals.css";
import type { Metadata } from "next";

const DEFAULT_TITLE = "dev-record | Fullstack Engineering & Cloud Journey";
const DEFAULT_DESC =
  "A digital log of fullstack projects, AWS serverless architecture, and continuous learning by Ulises Capistrán.";
// Use the CloudFront URL or your custom domain
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://d3ij1xil9no95.cloudfront.net";

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_BLOG_TITLE || DEFAULT_TITLE,
    template: "%s | dev-record", // This allows posts to show as: "My Post Title | dev-record"
  },
  description: process.env.NEXT_PUBLIC_BLOG_DESC || DEFAULT_DESC,
  keywords: [
    "Fullstack Development",
    "AWS Serverless",
    "Next.js",
    "TypeScript",
    "Cloud Architecture",
    "DevOps",
    "Engineering Blog",
  ],
  authors: [{ name: "Ulises Capistrán" }],
  metadataBase: new URL(SITE_URL),

  // Canonical configuration to prevent duplicate content issues
  alternates: {
    canonical: "/",
  },

  // Open Graph configuration for social media sharing
  openGraph: {
    title: process.env.NEXT_PUBLIC_BLOG_TITLE || DEFAULT_TITLE,
    description: process.env.NEXT_PUBLIC_BLOG_DESC || DEFAULT_DESC,
    url: SITE_URL,
    siteName: "dev-record",
    type: "website",
    locale: "en_US",
  },

  // Twitter Card configuration
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_BLOG_TITLE || DEFAULT_TITLE,
    description: process.env.NEXT_PUBLIC_BLOG_DESC || DEFAULT_DESC,
    creator: "@CapistranUlises",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Charset is handled automatically by Next.js metadata, but keep it if you prefer */}
      <body className="min-h-screen bg-white text-black">
        <AuthProvider>
          {/* Global Navbar with access to AuthContext */}
          <Navbar />

          {/* Main content injection (pages, posts, etc.) */}
          {children}

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
