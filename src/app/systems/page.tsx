import type { Metadata } from "next";
import { SystemsSection } from "@/components/sections/SystemsSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `University Systems — ${BRAND_NAME}`,
  description:
    "Access official MUST university platforms for registration, learning, and communication.",
};

/**
 * /systems route (Sprint 1.3). Composes the SystemsSection only —
 * Navbar and Footer come from the root layout's Providers.
 */
export default function SystemsPage() {
  return <SystemsSection />;
}
