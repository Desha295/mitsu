"use client";

import * as Icons from "lucide-react";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CommitteeCard } from "@/components/shared/CommitteeCard";
import { committees, unionSocialLinks } from "@/data/union";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { unionService } from "@/lib/firebase/services";
import type { CommitteeDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { cx, focusRing } from "@/lib/utils";

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention as
 * Phases 4.0–4.5. Matches the deployed security rule for /committees
 * (`isActive == true`) and the project's established "order ascending"
 * convention for this list.
 */
const ACTIVE_COMMITTEES_ORDERED: QueryOptions<CommitteeDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

/**
 * TEMPORARY Sprint 4 compatibility shim — not a permanent pattern, and
 * NOT reused outside this file.
 *
 * `icon` is a presentation-only field that doesn't exist in Firestore's
 * CommitteeDoc (confirmed against collections.ts and CommitteeForm.tsx —
 * fields are only name/description/imageUrl/isActive/order). Per your
 * direction, the current UI must not lose its committee icons during
 * Sprint 4, so `icon` is temporarily still sourced from the static seed
 * data in src/data/union.ts, joined to each Firestore doc by `order` —
 * the only field both models share and are expected to keep in sync
 * (Firestore docs don't carry the static "scientific"/"cultural"/etc.
 * slugs as their document ID).
 *
 * A Firestore committee whose `order` doesn't match any static entry
 * simply renders without an icon — graceful, not guessed.
 *
 * To be migrated properly into Firestore (icon, and the union social
 * links below) in a future content-model revision, once the rest of the
 * public site is on Firebase. This mapping is isolated to
 * CommitteesSection and must not be imported elsewhere.
 */
const STATIC_ICON_BY_ORDER: Record<number, string> = Object.fromEntries(
  committees.map((committee) => [committee.order, committee.icon])
);

/**
 * Committees section (components/sections). Renders all committees via
 * the reusable CommitteeCard component, then — per the page composition
 * order in Sprint 1.5 (... → Committees → Social Links) — the official
 * Union social links directly beneath.
 *
 * Sprint 4 — Phase 4.6: name/description/isActive/order now come live
 * from Firestore via unionService instead of src/data/union.ts's
 * `committees` array (left in place as historical reference, and as the
 * temporary source for `icon` — see STATIC_ICON_BY_ORDER above).
 * `unionSocialLinks` has no Firestore field anywhere (checked the unused
 * `settings` collection too, no match) and stays sourced from the same
 * static file, unchanged — these are the official Union channels, kept
 * separate from the President's personal social links (rendered only in
 * LeaderCard, Phase 4.7).
 */
export function CommitteesSection() {
  const { translate } = useLanguage();
  const {
    data: sortedCommittees,
    loading,
    error,
  } = useFirestoreList(unionService, ACTIVE_COMMITTEES_ORDERED);

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

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3"
          >
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-foreground/60">
              {translate("common.loading")}
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("union.committeesErrorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {sortedCommittees.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedCommittees.map((committee) => (
                  <CommitteeCard
                    key={committee.id}
                    name={committee.name}
                    description={committee.description}
                    icon={STATIC_ICON_BY_ORDER[committee.order]}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("union.committeesEmptyState")}
              </p>
            )}
          </>
        )}

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
