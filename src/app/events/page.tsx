import type { Metadata } from "next";
import { EventsSection } from "@/components/sections/EventsSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Events — ${BRAND_NAME}`,
  description:
    "Upcoming events and activities organized by the MUST Information Technology Student Union.",
};

export default function EventsPage() {
  return <EventsSection />;
}