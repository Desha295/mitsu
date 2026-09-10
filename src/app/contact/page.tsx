import type { Metadata } from "next";

import { ContactSection } from "@/components/sections/ContactSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Contact — ${BRAND_NAME}`,
  description:
    "Contact the IT Student Union through MITSU's official communication channels.",
};

export default function ContactPage() {
  return <ContactSection />;
}
