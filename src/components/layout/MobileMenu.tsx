"use client";

import { useEffect, useRef } from "react";
import { NavLinks } from "@/components/layout/NavLinks";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

/**
 * Mobile navigation drawer, shown below the Navbar when the hamburger
 * button is toggled. Only mounts while open, so it never duplicates the
 * desktop nav in the accessibility tree.
 *
 * Accessibility: moves focus into the panel on open, closes on Escape,
 * closes when a link is activated, and locks background scroll while open
 * (07_COMPONENT_RULES.md §14).
 */
export function MobileMenu({ open, onClose, id }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    // Scroll lock: a DOM-level concern outside this component's own tree,
    // so it's handled imperatively rather than via a Tailwind class.
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id={`${id}-wrapper`} className="md:hidden">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-40 animate-fade-in bg-overlay"
      />
      <div
        ref={panelRef}
        id={id}
        className="fixed inset-x-4 top-16 z-50 animate-fade-slide-down rounded-lg border border-border bg-surface p-4 shadow-lg sm:inset-x-6"
      >
        <nav aria-label={translate("navbar.mobileNavigation")}>
          <NavLinks orientation="vertical" onNavigate={onClose} />
        </nav>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
