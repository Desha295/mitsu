import { HeroSection } from "@/components/sections/HeroSection";
import { QuickAccessSection } from "@/components/sections/QuickAccessSection";

/**
 * Homepage (src/app/page.tsx)
 * Real Phase 1 homepage composed from reusable sections.
 * Layout structure: Navbar (from Providers) → Hero → QuickAccess → Footer (from Providers).
 * All content is data-driven from src/data/home.ts — no hardcoding per 13_CHANGE_POLICY.md.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickAccessSection />
    </>
  );
}
