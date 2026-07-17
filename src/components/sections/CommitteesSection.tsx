"use client";

import * as Icons from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CommitteeCard } from "@/components/shared/CommitteeCard";
import { committees, unionSocialLinks } from "@/data/union";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

/**
 * Committees section (components/sections). Renders all committees via
 * the reusable CommitteeCard component, then — per the page composition
 * order in Sprint 1.5 (... → Committees → Social Links) — the official
 * Union social links directly beneath.
 *
 * These are the official Union channels, kept separate from the
 * President's personal social links (rendered only in LeaderCard).
 */
export function CommitteesSection() {
  const { translate } = useLanguage();
  const sortedCommittees = [...committees].sort((a, b) => a.order - b.order);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("union.committeesHeading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("union.committeesSubheading")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCommittees.map((committee) => (
            <CommitteeCard key={committee.id} committee={committee} />
          ))}
        </div>

        {/* Official Union social links */}
        <div className="border-t border-border pt-10 text-center">
          <h2 className="text-2xl font-bold text-foreground">
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
        </div>
      </Container>
    </section>
  );
}
