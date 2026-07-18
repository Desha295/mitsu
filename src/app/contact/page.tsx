import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { SocialLinksSection } from "@/components/sections/SocialLinksSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Contact — ${BRAND_NAME}`,
  description:
    "Contact the MITSU Student Union office, leadership, and official channels.",
};

/**
 * /contact route (Sprint 1.7). Composition: Contact (office info +
 * President + communication channels) → Social Links. Navbar/Footer
 * inherited from root layout via Providers.
 */
export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <SocialLinksSection />
    </>
  );
}
