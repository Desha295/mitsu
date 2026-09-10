"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { useLanguage } from "@/hooks/useLanguage";
import { IconButton } from "@/components/ui/IconButton";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { translate } = useLanguage();

  const hamburgerLabel = mobileMenuOpen
    ? translate("navbar.closeMenu")
    : translate("navbar.openMenu");

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div
          className={[
            "relative overflow-visible rounded-[24px]",
            "border border-border/70",
            "bg-surface/90 backdrop-blur-2xl",
            "shadow-[0_12px_40px_rgba(0,0,0,0.07)]",
            "dark:shadow-[0_12px_40px_rgba(0,0,0,0.28)]",
          ].join(" ")}
        >
          {/* Subtle top accent */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <Container className="flex h-[4.75rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="shrink-0">
              <Logo showIdentity={false} />
            </div>

            {/* Desktop navigation */}
            <nav
              aria-label={translate("navbar.mainNavigation")}
              className="hidden min-w-0 flex-1 md:block"
            >
              <NavLinks orientation="horizontal" />
            </nav>

            {/* Actions */}
            <div
              className={[
                "ms-auto flex shrink-0 items-center gap-1.5",
                "rounded-2xl border border-border/70",
                "bg-background/70 p-1.5",
                "shadow-sm backdrop-blur-xl",
              ].join(" ")}
            >
              <NotificationBell />

              <div className="hidden h-6 w-px bg-border/70 sm:block" />

              <LanguageSwitcher />

              <ThemeSwitcher />

              <div className="hidden h-6 w-px bg-border/70 md:block" />

              <IconButton
                label={hamburgerLabel}
                onClick={() =>
                  setMobileMenuOpen((current) => !current)
                }
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                ) : (
                  <Menu
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                )}
              </IconButton>
            </div>
          </Container>
        </div>
      </div>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        id="mobile-menu"
      />
    </header>
  );
}
