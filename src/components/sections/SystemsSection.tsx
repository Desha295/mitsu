"use client";

import { Container } from "@/components/layout/Container";
import { SystemCard } from "@/components/shared/SystemCard";
import { systems, PASSWORD_RESET_URL } from "@/data/systems";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

/**
 * University Systems section (components/sections — large page section
 * per 07_COMPONENT_RULES.md §3.3). Renders active systems from
 * data/systems.ts as a responsive grid of reusable SystemCard components.
 *
 * Sprint 1.3 scope only — no Firebase, no admin management, no additional
 * pages beyond this section.
 */
export function SystemsSection() {
  const { translate } = useLanguage();

  const activeSystems = [...systems]
    .filter((system) => system.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {translate("systems.heading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("systems.subheading")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeSystems.map((system) => (
            <SystemCard key={system.id} system={system} />
          ))}
        </div>

        {/* Password reset note — relevant to Teams/Outlook/MUSTER accounts */}
        <p className="text-center text-sm text-foreground/60">
          {translate("systems.passwordReset.label")}{" "}
          <a
            href={PASSWORD_RESET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
              "rounded-sm font-medium text-primary underline-offset-2 hover:underline",
              focusRing
            )}
          >
            {translate("systems.passwordReset.linkText")}
          </a>
        </p>
      </Container>
    </section>
  );
}
