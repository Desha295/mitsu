import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sprint 4 — Phase 4.0: Hero's imageUrl now comes from Firestore,
    // populated via the existing uploadImage() Storage helper, which
    // returns a firebasestorage.googleapis.com download URL. Needed for
    // next/image to render it; local /public/images paths still work
    // unaffected since this only adds an allowed remote host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
