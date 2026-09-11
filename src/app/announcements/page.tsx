import type { Metadata } from "next";
import { AnnouncementsSection } from "@/components/sections/AnnouncementsSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Announcements — ${BRAND_NAME}`,
  description:
    "Official Student Union announcements for MUST IT students.",
};

/**
 * /announcements route.
 * Displays official Student Union announcements.
 * Events are available separately at /events.
 */
export default function AnnouncementsPage() {
  return <AnnouncementsSection />;
}