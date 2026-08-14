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
import { BRAND_NAME, BRAND_FULL_NAME } from "@/constants/brand";

export function Footer() {
  const { translate, language } = useLanguage();
  const year = new Date().getFullYear();

  const { data: activeSystems } = useFirestoreList(
    systemsService,
    ACTIVE_SYSTEMS_ORDERED
  );

  const quickLinks = mainNavigation.map((item) => ({
    label: translate(item.labelKey),
    href: item.href,
  }));

  const systemLinks = activeSystems.map((s) => ({
    label: language === "ar" ? s.nameAr : s.nameEn,
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
            <span className="block">{BRAND_FULL_NAME}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}