import type { Metadata } from "next";
import { UnionHeroSection } from "@/components/sections/UnionHeroSection";
import { LeadershipSection } from "@/components/sections/LeadershipSection";
import { CommitteesSection } from "@/components/sections/CommitteesSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Student Union — ${BRAND_NAME}`,
  description:
    "Meet the MITSU Student Union: vision, mission, leadership, and committees.",
};

/**
 * /union route (Sprint 1.5). Composition order: Union Hero (identity +
 * vision/mission) → Leadership → Committees (+ official social links).
 * Navbar/Footer inherited from root layout via Providers.
 */
export default function UnionPage() {
  return (
    <>
      <UnionHeroSection />
      <LeadershipSection />
      <CommitteesSection />
    </>
  );
}
