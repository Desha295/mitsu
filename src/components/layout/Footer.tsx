"use client";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { FooterLinkGroup } from "@/components/layout/FooterLinkGroup";
import { FooterSocialLinks } from "@/components/layout/FooterSocialLinks";
import { mainNavigation } from "@/data/navigation";
import { systems } from "@/data/systems";
import { useLanguage } from "@/hooks/useLanguage";
import { BRAND_NAME } from "@/constants/brand";

/**
 * Global footer (components/layout). Includes MITSU branding, quick links,
 * university systems directory, and social placeholder section. Link content
 * is sourced from data files (no hardcoding per Sprint 1.1 requirements).
 */
export function Footer() {
  const { translate } = useLanguage();
  const year = new Date().getFullYear();

  // Convert mainNavigation to FooterLinkGroup format
  const quickLinks = mainNavigation.map((item) => ({
    label: translate(item.labelKey),
    href: item.href,
  }));

  // Convert systems to FooterLinkGroup format — now using real officialUrl
  // where available (Sprint 1.3 populated official data); empty href still
  // renders as a "coming soon" placeholder (e.g. MUSTER has no web portal).
  const systemLinks = systems
    .filter((s) => s.isActive)
    .map((s) => ({
      label: translate(s.nameKey),
      href: s.officialUrl || undefined,
    }));

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand section */}
          <div>
            <Logo showIdentity={true} />
            <p className="mt-4 text-sm text-foreground/70">
              {translate("footer.aboutText")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <FooterLinkGroup
              heading={translate("footer.linksHeading")}
              items={quickLinks}
            />
          </div>

          {/* University Systems */}
          <div>
            <FooterLinkGroup
              heading={translate("footer.systemsHeading")}
              items={systemLinks}
            />
          </div>

          {/* Social + Copyright */}
          <div className="flex flex-col">
            <FooterSocialLinks />
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-xs text-foreground/50">
            <span className="block">
              © {year} {BRAND_NAME}. {translate("footer.rightsReserved")}
            </span>
            <span className="block">
              MUST Faculty of Information Technology Student Union
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
