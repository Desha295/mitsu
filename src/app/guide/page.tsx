import type { Metadata } from "next";
import { FreshmanGuideSection } from "@/components/sections/FreshmanGuideSection";
import { StudyPlansSection } from "@/components/sections/StudyPlansSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Freshman Guide — ${BRAND_NAME}`,
  description:
    "Registration process, academic advising, credit hours, GPA rules, and official study plans for MUST IT students.",
};

/**
 * /guide route (Sprint 1.4). Composes FreshmanGuideSection +
 * StudyPlansSection. Navbar/Footer inherited from root layout's Providers.
 */
export default function GuidePage() {
  return (
    <>
      <FreshmanGuideSection />
      <StudyPlansSection />
    </>
  );
}
