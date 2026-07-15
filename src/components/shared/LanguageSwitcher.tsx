"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Language toggle (components/shared). The button's visible text is the
 * target language name, which also serves as its accessible name — no
 * separate aria-label needed since the visible label already says what
 * the control does (WCAG "label in name").
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, toggleLanguage, translate } = useLanguage();

  const label =
    language === "en"
      ? translate("language.switchToArabic")
      : translate("language.switchToEnglish");

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cx(
        "inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
        focusRing,
        className
      )}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
