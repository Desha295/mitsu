"use client";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { FooterLinkGroup } from "@/components/layout/FooterLinkGroup";
import { FooterSocialLinks } from "@/components/layout/FooterSocialLinks";
import { mainNavigation } from "@/data/navigation";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { ACTIVE_SYSTEMS_ORDERED } from "@/components/sections/SystemsSection";
import { systemsService } from "@/lib/firebase/services";
import { useLanguage } from "@/hooks/useLanguage";
import { BRAND_NAME } from "@/constants/brand";

/**
 * Global footer (components/layout). Includes MITSU branding, quick links,
 * university systems directory, and social placeholder section. Link content
 * is sourced from data files (no hardcoding per Sprint 1.1 requirements).
 *
 * Sprint 4.4 cleanup: the University Systems column now reads from
 * Firestore via systemsService, using the exact same query
 * (ACTIVE_SYSTEMS_ORDERED, imported from SystemsSection rather than
 * redefined) that powers the /systems page itself — this was found
 * during the Sprint 4 runtime-import audit as an independent static
 * dependency Phase 4.4 had missed, since the Footer builds its own list
 * rather than rendering SystemsSection.
 */
export function Footer() {
  const { translate } = useLanguage();
  const year = new Date().getFullYear();
  const { data: activeSystems } = useFirestoreList(
    systemsService,
    ACTIVE_SYSTEMS_ORDERED
  );

  // Convert mainNavigation to FooterLinkGroup format
  const quickLinks = mainNavigation.map((item) => ({
    label: translate(item.labelKey),
    href: item.href,
  }));

  // Convert systems to FooterLinkGroup format — name/officialUrl come
  // directly from Firestore now (plain strings, not translation keys);
  // empty href still renders as a "coming soon" placeholder (e.g. MUSTER
  // has no web portal). The query already filters isActive and orders
  // by `order`, so no client-side filter/sort is needed here.
  const systemLinks = activeSystems.map((s) => ({
    label: s.name,
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
