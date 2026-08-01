"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LeaderCard } from "@/components/shared/LeaderCard";
import { president, vicePresident, type SocialLinkItem } from "@/data/union";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { leadershipService } from "@/lib/firebase/services";
import type { LeadershipDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention as
 * Phases 4.0–4.6. Matches the deployed security rule for /leadership
 * (`isActive == true`) and the project's established "order ascending"
 * convention for this list.
 */
const ACTIVE_LEADERS_ORDERED: QueryOptions<LeadershipDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

/**
 * TEMPORARY Sprint 4 compatibility shim — not a permanent pattern, and
 * NOT reused outside this file (LeaderCard itself has no dependency on
 * this — its prop contract is plain and clean; ContactSection resolves
 * its own static data independently).
 *
 * `socialLinks` (and, for the image, an alt-text string) are
 * presentation-only concerns that don't exist in Firestore's
 * LeadershipDoc (confirmed against collections.ts and LeadershipForm.tsx
 * — fields are only name/position/imageUrl/bio/isActive/order). Per your
 * direction, the current UI must not lose the President's personal
 * social links during Sprint 4, so they're temporarily still sourced
 * from static data in src/data/union.ts.
 *
 * Unlike Systems/Committees, the static `president`/`vicePresident`
 * exports have no `order` field of their own to join on, so — per your
 * explicit direction — this mapping assigns the join key itself, fixed
 * at order = 1 → President, order = 2 → Vice President, matching the
 * documented initial structure in 06_FIREBASE_SCHEMA.md. A Firestore
 * leadership doc whose `order` isn't 1 or 2 simply renders with no
 * social links row — graceful, not guessed.
 *
 * To be migrated properly into Firestore in a future content-model
 * revision, once the rest of the public site is on Firebase.
 */
const STATIC_SOCIAL_LINKS_BY_ORDER: Record<number, SocialLinkItem[]> = {
  1: president.socialLinks,
  2: vicePresident.socialLinks,
};

/**
 * Leadership section (components/sections). Renders leaders via the
 * reusable LeaderCard component.
 *
 * Sprint 4 — Phase 4.7: name/position/imageUrl/isActive/order now come
 * live from Firestore via leadershipService instead of
 * src/data/union.ts's `president`/`vicePresident` exports (left in
 * place as historical reference, and as the temporary source for
 * personal social links — see STATIC_SOCIAL_LINKS_BY_ORDER above).
 * Firestore's imageUrl is optional, so a leader with none renders
 * LeaderCard's built-in placeholder rather than a broken image — same
 * pattern already used for Hero's optional image. There's no alt-text
 * field in Firestore either, so alt text is derived directly from the
 * leader's own name/position (concatenated per 09_DEVELOPMENT_STANDARDS
 * convention, since translate() doesn't support interpolation) rather
 * than a generic placeholder string.
 */
export function LeadershipSection() {
  const { translate } = useLanguage();
  const {
    data: activeLeaders,
    loading,
    error,
  } = useFirestoreList(leadershipService, ACTIVE_LEADERS_ORDERED);

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("union.leadershipHeading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("union.leadershipSubheading")}
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="flex min-h-[14rem] flex-col items-center justify-center gap-3"
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
            className="flex min-h-[14rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("union.leadershipErrorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeLeaders.length > 0 ? (
              <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
                {activeLeaders.map((leader) => (
                  <LeaderCard
                    key={leader.id}
                    name={leader.name}
                    position={leader.position}
                    imageUrl={leader.imageUrl}
                    imageAlt={leader.name + ", " + leader.position}
                    socialLinks={STATIC_SOCIAL_LINKS_BY_ORDER[leader.order]}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("union.leadershipEmptyState")}
              </p>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
