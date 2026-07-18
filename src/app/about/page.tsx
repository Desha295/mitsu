import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionMissionSection } from "@/components/sections/VisionMissionSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `About — ${BRAND_NAME}`,
  description:
    "Learn about MITSU's identity, vision, mission, and the platform goals that guide every decision.",
};

/**
 * /about route (Sprint 1.7). Composition: About (identity + platform
 * goals) → Vision & Mission. Navbar/Footer inherited from root layout.
 */
export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <VisionMissionSection />
    </>
  );
}
