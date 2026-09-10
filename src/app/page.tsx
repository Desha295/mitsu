import { HeroSection } from "@/components/sections/HeroSection";
import { QuickAccessSection } from "@/components/sections/QuickAccessSection";
import { AnnouncementsSection } from "@/components/sections/AnnouncementsSection";
import { CampusSection } from "@/components/sections/CampusSection";
import { FacultyLeadershipSection } from "@/components/sections/FacultyLeadershipSection";

/**
 * Homepage (src/app/page.tsx)
 * Main homepage composition:
 * Hero → Quick Access → Announcements Preview → Campus → Faculty Leadership
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickAccessSection />
      <AnnouncementsSection homePreview />
      <CampusSection />
      <FacultyLeadershipSection />
    </>
  );
}