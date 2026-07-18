"use client";

import * as Icons from "lucide-react";
import { Container } from "@/components/layout/Container";
import { unionSocialLinks } from "@/data/union";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

/**
 * Social Links section (components/sections) for the Contact page.
 * Reuses `unionSocialLinks` from src/data/union.ts (Sprint 1.5) directly
 * — these are the same official Facebook/Instagram/Faculty Group/
 * WhatsApp Community links already shown on the Student Union page, not
 * a duplicated copy. Reuses the existing "union.socialHeading"/
 * "socialSubheading" translation keys for the same reason.
 */
export function SocialLinksSection() {
  const { translate } = useLanguage();

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="text-center">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {translate("union.socialHeading")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-foreground/70">
          {translate("union.socialSubheading")}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {unionSocialLinks.map((social) => {
            const IconComponent = (
              Icons as unknown as Record<
                string,
                React.ComponentType<{ className?: string }>
              >
            )[social.icon];
            const label = translate(social.labelKey);

            return (
              <a
                key={social.labelKey}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
                  focusRing
                )}
              >
                {IconComponent && (
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                )}
                {label}
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
