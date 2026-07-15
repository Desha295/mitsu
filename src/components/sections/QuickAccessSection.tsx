"use client";

import { Container } from "@/components/layout/Container";
import { QuickAccessCard } from "@/components/shared/QuickAccessCard";
import { quickAccessItems } from "@/data/home";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Quick Access Section (components/sections — large page section per 07_COMPONENT_RULES.md §3.3).
 * Renders 6 reusable QuickAccessCard components in a responsive grid.
 * Data comes from data/home.ts, cards handle their own translation and interaction.
 * Supports: responsive grid (mobile: 1 col, tablet: 2 cols, desktop: 3 cols), dark mode, EN/AR.
 */
export function QuickAccessSection() {
  const { translate } = useLanguage();

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {translate("home.quickAccess.heading")}
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            {translate("home.quickAccess.subheading")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccessItems.map((item) => (
            <QuickAccessCard
              key={item.id}
              titleKey={item.titleKey}
              descriptionKey={item.descriptionKey}
              href={item.href}
              iconName={item.icon}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
