import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Tailwind produces a small atomic stylesheet. Inlining it removes the
    // extra render-blocking request on a visitor's first page load.
    inlineCss: true,
  },
  turbopack: {
    resolveAlias: {
      // Next 16 currently bundles these ES polyfills unconditionally even
      // though every browser in its documented support matrix has them.
      "../build/polyfills/polyfill-module": "./src/lib/modern-polyfills.js",
      "next/dist/build/polyfills/polyfill-module": "./src/lib/modern-polyfills.js",
    },
  },
  transpilePackages: ["next"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/yol2v1w5/**",
      },
    ],
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://apis.google.com https://www.gstatic.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com",
      "font-src 'self' data:",
      `connect-src 'self'${isDevelopment ? " ws://localhost:* ws://127.0.0.1:*" : ""} https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com`,
      "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
        ],
      },
    ];
  },
};

export default nextConfig;
