import type { NextConfig } from "next";

const securityHeaders = [
  // Evita que el sitio se pueda incrustar en un iframe ajeno (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Evita que el navegador intente "adivinar" el tipo de un archivo servido.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No filtra la URL completa de origen al navegar a enlaces externos.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs del navegador que este sitio no usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Fuerza HTTPS en visitas futuras durante 2 años.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.131', '192.168.1.128', '192.168.1.135', '192.168.1.140'],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
