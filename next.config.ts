import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // No necesitamos swcMinify aquí, Next ya lo hace solito
  images: {
    unoptimized: true,
  },
  // Si quieres mejorar la velocidad de compilación y reducir basura en el build:
  compiler: {
    // Elimina console.logs en producción (ahorra unos cuantos bytes y mejora privacidad)
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
