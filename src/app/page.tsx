import { HeroSection } from "@/components/sections/HeroSection";
import { QuickAccessSection } from "@/components/sections/QuickAccessSection";
import { CampusSection } from "@/components/sections/CampusSection";
import { FacultyLeadershipSection } from "@/components/sections/FacultyLeadershipSection";

/**
 * Homepage (src/app/page.tsx)
 * Real Phase 1 homepage composed from reusable sections.
 * Layout structure: Navbar (from Providers) → Hero → QuickAccess → Campus (Sprint 6.1, renders only when Settings has a campus image) → Faculty Leadership (Sprint 7.0) → Footer (from Providers).
 * All content is data-driven — no hardcoding per 13_CHANGE_POLICY.md.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickAccessSection />
      <CampusSection />
      <FacultyLeadershipSection />
    </>
  );
}
