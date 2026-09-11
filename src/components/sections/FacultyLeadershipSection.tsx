"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LeaderCard } from "@/components/shared/LeaderCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { facultyLeadershipService } from "@/lib/firebase/services";
import type { FacultyLeadershipDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

const ACTIVE_MEMBERS_ORDERED: QueryOptions<FacultyLeadershipDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

export function FacultyLeadershipSection() {
  const { translate, language } = useLanguage();

  const {
    data: members,
    loading,
    error,
  } = useFirestoreList(
    facultyLeadershipService,
    ACTIVE_MEMBERS_ORDERED
  );

  if (!loading && (error || members.length === 0)) {
    return null;
  }

  const getName = (member: FacultyLeadershipDoc) =>
    language === "ar" ? member.nameAr : member.nameEn;

  const getRole = (member: FacultyLeadershipDoc) =>
    language === "ar" ? member.roleAr : member.roleEn;

  const renderCard = (
    member: FacultyLeadershipDoc,
    index: number
  ) => {
    const name = getName(member);
    const role = getRole(member);

    return (
      <LeaderCard
        key={`${member.order}-${index}`}
        name={name}
        position={role}
        imageUrl={member.imageUrl}
        imageAlt={`${name}, ${role}`}
      />
    );
  };

  return (
    <section className="relative overflow-hidden bg-background py-14 sm:py-16 md:py-20">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container className="relative">
        {/* Header */}
        <div
          className="mx-auto max-w-3xl text-center"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {translate("home.facultyLeadership.heading")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground/65 sm:text-lg">
            {translate("home.facultyLeadership.subheading")}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div
            role="status"
            className="mx-auto mt-10 flex min-h-[16rem] max-w-5xl flex-col items-center justify-center gap-3 rounded-3xl border border-border/70 bg-surface/70 shadow-sm backdrop-blur-sm"
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

        {!loading && (
          <div className="mx-auto mt-12 w-full max-w-6xl">
            {/* Dean */}
            {members[0] && (
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  {renderCard(members[0], 0)}
                </div>
              </div>
            )}

            {/* Vice Deans - 3 in one row */}
            {members.length > 1 && (
              <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
                {members.slice(1, 4).map((member, index) =>
                  renderCard(member, index + 1)
                )}
              </div>
            )}

            {/* Administrative Leaders */}
            {members.length > 4 && (
              <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-6">
                {members.slice(4).map((member, index) => (
                  <div
                    key={`${member.order}-${index + 4}`}
                    className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    {renderCard(member, index + 4)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}