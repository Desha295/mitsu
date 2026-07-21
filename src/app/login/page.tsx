import type { Metadata } from "next";
import { LoginSection } from "@/components/sections/LoginSection";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: `Admin Sign In — ${BRAND_NAME}`,
  robots: { index: false, follow: false },
};

/**
 * /login route (Sprint 2.4). Composes LoginSection only. Not linked
 * from main navigation — this is an admin-facing utility page, not
 * student-facing content. Navbar/Footer inherited from root layout via
 * Providers.
 */
export default function LoginPage() {
  return <LoginSection />;
}
