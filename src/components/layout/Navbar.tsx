"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { IconButton } from "@/components/ui/IconButton";
import { focusRing } from "@/lib/utils";

/**
 * Global navbar (components/layout). Desktop-first: shows full navigation
 * on md and up, hamburger menu + mobile drawer on smaller screens. Logo,
 * nav items, theme/language switchers all present in both views.
 *
 * No hardcoded navigation — all links come from data/navigation.ts per
 * Sprint 1.1 Navbar requirements.
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { translate } = useLanguage();

  const hamburgerLabel = mobileMenuOpen
    ? translate("navbar.closeMenu")
    : translate("navbar.openMenu");

  return (
    <header className="border-b border-border bg-surface sticky top-0 z-40">
      <Container className="flex h-16 items-center justify-between">
        {/* Skip to main content link (visible on focus) */}
        <a
          href="#main-content"
          className={`absolute -top-12 left-4 rounded px-2 py-1 text-sm bg-primary text-white focus-visible:top-4 ${focusRing}`}
        >
          {translate("navbar.skipToContent")}
        </a>

        {/* Logo */}
        <Logo showIdentity={false} />

        {/* Desktop Navigation */}
        <nav
          aria-label={translate("navbar.mainNavigation")}
          className="hidden md:block"
        >
          <NavLinks orientation="horizontal" />
        </nav>

        {/* Right controls (theme, language, mobile menu button) */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />

          {/* Mobile hamburger button */}
          <IconButton
            label={hamburgerLabel}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </Container>

      {/* Mobile navigation drawer */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        id="mobile-menu"
      />
    </header>
  );
}
