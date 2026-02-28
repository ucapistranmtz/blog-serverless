// app/layout.tsx
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/NavBar";
import { Footer } from "./components/sections/Footer";
import "./globals.css"; // Asegúrate de importar tus estilos aquí
import type { Metadata } from "next";

const DEFAULT_TITLE = "dev-record | Fullstack Engineering & Cloud Journey";
const DEFAULT_DESC =
  "A digital log of fullstack projects, AWS serverless architecture, and continuous learning by Ulises Capistrán.";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://your-s3-bucket-url.com";

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_BLOG_TITLE || DEFAULT_TITLE,
    template: "%s | dev-record", // Esto permite que los posts digan: "Mi Post | dev-record"
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

  // Open Graph (Para que se vea increíble en LinkedIn/Discord)
  openGraph: {
    title: process.env.NEXT_PUBLIC_BLOG_TITLE || DEFAULT_TITLE,
    description: process.env.NEXT_PUBLIC_BLOG_DESC || DEFAULT_DESC,
    url: SITE_URL,
    siteName: "dev-record",
    type: "website",
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_BLOG_TITLE || DEFAULT_TITLE,
    description: process.env.NEXT_PUBLIC_BLOG_DESC || DEFAULT_DESC,
    creator: "@CapistranUlises", // Opcional
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <AuthProvider>
          {/* El Navbar ahora es global y puede usar useAuth() */}
          <Navbar />

          {/* Aquí se inyectan page.tsx, login/page.tsx, etc. */}
          {children}

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
