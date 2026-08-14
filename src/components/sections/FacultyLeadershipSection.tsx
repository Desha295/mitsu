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

        {!loading && !error && (
          <>
            {members.length > 0 ? (
              <div className="mx-auto w-full max-w-4xl space-y-6">
                {/* Dean */}
                {members[0] && (
                  <div className="flex justify-center">
                    <div className="w-full sm:max-w-sm">
                      {(() => {
                        const name =
                          language === "ar"
                            ? members[0].nameAr
                            : members[0].nameEn;
                        const role =
                          language === "ar"
                            ? members[0].roleAr
                            : members[0].roleEn;

                        return (
                          <LeaderCard
                            key={members[0].id}
                            name={name}
                            position={role}
                            imageUrl={members[0].imageUrl}
                            imageAlt={`${name}, ${role}`}
                          />
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Vice Deans */}
                {members.length > 1 && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {members.slice(1, 3).map((member) => {
                      const name =
                        language === "ar" ? member.nameAr : member.nameEn;
                      const role =
                        language === "ar" ? member.roleAr : member.roleEn;

                      return (
                        <div
                          key={member.id}
                          className="w-full sm:mx-auto sm:max-w-sm"
                        >
                          <LeaderCard
                            name={name}
                            position={role}
                            imageUrl={member.imageUrl}
                            imageAlt={`${name}, ${role}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Other Leaders */}
                {members.length > 3 && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {members.slice(3).map((member) => {
                      const name =
                        language === "ar" ? member.nameAr : member.nameEn;
                      const role =
                        language === "ar" ? member.roleAr : member.roleEn;

                      return (
                        <LeaderCard
                          key={member.id}
                          name={name}
                          position={role}
                          imageUrl={member.imageUrl}
                          imageAlt={`${name}, ${role}`}
                        />
                      );
                    })}
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