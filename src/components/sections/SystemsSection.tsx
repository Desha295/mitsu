"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SystemCard } from "@/components/shared/SystemCard";
import { systems, PASSWORD_RESET_URL } from "@/data/systems";
import type { SystemCategory } from "@/types/system.types";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { systemsService } from "@/lib/firebase/services";
import type { SystemDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { cx, focusRing } from "@/lib/utils";

export const ACTIVE_SYSTEMS_ORDERED: QueryOptions<SystemDoc> = {  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

const STATIC_PRESENTATION_BY_ORDER: Record<
  number,
  { category: SystemCategory; required: boolean }
> = Object.fromEntries(
  systems.map((system) => [
    system.order,
    { category: system.category, required: system.required },
  ])
);

export function SystemsSection() {
  const { translate, language } = useLanguage();

  const {
    data: activeSystems,
    loading,
    error,
  } = useFirestoreList(systemsService, ACTIVE_SYSTEMS_ORDERED);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("systems.heading")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("systems.subheading")}
          </p>
        </div>

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

        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("systems.errorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeSystems.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeSystems.map((system) => {
                  const presentation =
                    STATIC_PRESENTATION_BY_ORDER[system.order];

                  const name =
                    language === "ar"
                      ? system.nameAr
                      : system.nameEn;

                  const description =
                    language === "ar"
                      ? system.descriptionAr
                      : system.descriptionEn;

                  return (
                    <SystemCard
                    key={system.id}
                    name={name}
                    description={description}
                    officialUrl={system.officialUrl}
                    icon={system.icon}
                    instructions={
                      language === "ar"
                        ? system.instructionsAr
                        : system.instructionsEn
                    }
                    category={presentation?.category}
                    required={presentation?.required}
/>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("systems.emptyState")}
              </p>
            )}

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
          </>
        )}
      </Container>
    </section>
  );
}