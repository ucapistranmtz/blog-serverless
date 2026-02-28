// app/layout.tsx
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/NavBar";
import { Footer } from "./components/sections/Footer";
import "./globals.css"; // Asegúrate de importar tus estilos aquí

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta charSet="utf-8" />
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
