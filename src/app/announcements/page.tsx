import type { Metadata } from "next";
import { AnnouncementsSection } from "@/components/sections/AnnouncementsSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Announcements & Events — ${BRAND_NAME}`,
  description:
    "Official Student Union announcements and upcoming events for MUST IT students.",
};

/**
 * /announcements route (Sprint 1.6). Composition: Announcements
 * (featured + search/filter + latest) → Events (upcoming grid).
 * Navbar/Footer inherited from root layout via Providers.
 */
export default function AnnouncementsPage() {
  return (
    <>
      <AnnouncementsSection />
      <EventsSection />
    </>
  );
}
