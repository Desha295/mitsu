"use client";

import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { BRAND_FULL_NAME, BRAND_NAME } from "@/constants/brand";

/**
 * Phase 0 verification page only.
 * Confirms fonts, Tailwind tokens, theme persistence, and language/RTL
 * switching all work end-to-end. Real Hero/QuickAccess/Announcements
 * sections are built in Phase 1 per 10_ROADMAP.md.
 */
export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { translate, language, toggleLanguage, direction } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-secondary">{BRAND_NAME}</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          {translate("foundation.title")}
        </h1>
        <p className="mt-3 text-sm text-foreground/70">
          {translate("foundation.description")}
        </p>
        <p className="mt-1 text-xs text-foreground/50">{BRAND_FULL_NAME}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {translate("foundation.themeLabel")}: {theme}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {translate("foundation.languageLabel")}: {language.toUpperCase()} ({direction})
          </button>
        </div>
      </div>
    </main>
  );
}
