"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LeaderCard } from "@/components/shared/LeaderCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { facultyLeadershipService } from "@/lib/firebase/services";
import type { FacultyLeadershipDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention used
 * by every migrated section since Phase 4. Matches the deployed
 * security rule for /facultyLeadership (`isActive == true`) and the
 * project's established "order ascending" convention for ordered lists.
 */
const ACTIVE_MEMBERS_ORDERED: QueryOptions<FacultyLeadershipDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

/**
 * Faculty Leadership section (components/sections — Sprint 7.0). New
 * public section for the `facultyLeadership` collection — distinct
 * from the existing Student Union `LeadershipSection`
 * (President/Vice President).
 *
 * Reuses `LeaderCard` directly rather than a new card component: its
 * existing shape (name, position, imageUrl?, imageAlt) already matches
 * exactly what's needed here (role maps to `position`), and its
 * optional `socialLinks` prop simply isn't passed (defaults to `[]`,
 * renders nothing extra) since Faculty Leadership has no such field.
 *
 * Follows the same loading/error/empty pattern established across
 * every Phase 4+ migrated section — full states, not a "hide when
 * empty" pattern (unlike Sprint 6.1's CampusSection, which is tied to
 * a single optional Settings field rather than a first-class CMS list).
 */
export function FacultyLeadershipSection() {
  const { translate } = useLanguage();
  const {
    data: members,
    loading,
    error,
  } = useFirestoreList(facultyLeadershipService, ACTIVE_MEMBERS_ORDERED);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("home.facultyLeadership.heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("home.facultyLeadership.subheading")}
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
              {translate("home.facultyLeadership.error")}
            </p>
          </div>
        )}

        {/* Members grid / empty state */}
        {!loading && !error && (
          <>
            {members.length > 0 ? (
  <div className="mx-auto w-full max-w-4xl space-y-6">
    {/* Dean */}
    {members[0] && (
      <div className="flex justify-center">
        <div className="w-full sm:max-w-sm">
          <LeaderCard
            key={members[0].id}
            name={members[0].name}
            position={members[0].role}
            imageUrl={members[0].imageUrl}
            imageAlt={members[0].name + ", " + members[0].role}
          />
        </div>
      </div>
    )}

    {/* Vice Deans */}
    {members.length > 1 && (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {members.slice(1, 3).map((member) => (
          <div key={member.id} className="w-full sm:mx-auto sm:max-w-sm">
            <LeaderCard
              name={member.name}
              position={member.role}
              imageUrl={member.imageUrl}
              imageAlt={member.name + ", " + member.role}
            />
          </div>
        ))}
      </div>
    )}

    {/* Other Leaders */}
    {members.length > 3 && (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.slice(3).map((member) => (
          <LeaderCard
            key={member.id}
            name={member.name}
            position={member.role}
            imageUrl={member.imageUrl}
            imageAlt={member.name + ", " + member.role}
          />
        ))}
      </div>
    )}
  </div>
) : (
              <p className="text-center text-foreground/60">
                {translate("home.facultyLeadership.empty")}
              </p>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
