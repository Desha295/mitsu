"use client";

import { KeyRound, Loader2, MonitorCog } from "lucide-react";

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

export const ACTIVE_SYSTEMS_ORDERED: QueryOptions<SystemDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

const STATIC_PRESENTATION_BY_ORDER: Record<
  number,
  { category: SystemCategory; required: boolean }
> = Object.fromEntries(
  systems.map((system) => [
    system.order,
    {
      category: system.category,
      required: system.required,
    },
  ])
);

export function SystemsSection() {
  const { translate, language } = useLanguage();

  const {
    data: activeSystems,
    loading,
    error,
  } = useFirestoreList(
    systemsService,
    ACTIVE_SYSTEMS_ORDERED
  );

  const systemsCount = activeSystems.length;

  const gridClassName = cx(
    "grid gap-5 sm:gap-6",
    systemsCount === 1 &&
      "mx-auto w-full max-w-md",
    systemsCount === 2 &&
      "mx-auto w-full max-w-4xl sm:grid-cols-2",
    systemsCount === 3 &&
      "mx-auto w-full max-w-6xl sm:grid-cols-2 lg:grid-cols-3",
    systemsCount === 4 &&
      "mx-auto w-full max-w-5xl sm:grid-cols-2",
    systemsCount >= 5 &&
      "mx-auto w-full max-w-7xl sm:grid-cols-2 lg:grid-cols-3"
  );

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <MonitorCog
              className="h-4 w-4"
              aria-hidden="true"
            />
            <span>
              {translate("systems.heading")}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {translate("systems.heading")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {translate("systems.subheading")}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div
            role="status"
            className="flex min-h-[20rem] flex-col items-center justify-center gap-4 rounded-3xl border border-border/70 bg-surface/60"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
              <Loader2
                className="h-7 w-7 animate-spin text-primary"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {translate("common.loading")}
            </p>
          </div>
        ) : null}

        {/* Error */}
        {!loading && error ? (
          <div
            role="alert"
            className="flex min-h-[20rem] flex-col items-center justify-center rounded-3xl border border-border/70 bg-surface/60 px-6 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("systems.errorState")}
            </p>
          </div>
        ) : null}

        {/* Systems */}
        {!loading && !error ? (
          <>
            {systemsCount > 0 ? (
              <div className={gridClassName}>
                {activeSystems.map((system) => {
                  const presentation =
                    STATIC_PRESENTATION_BY_ORDER[
                      system.order
                    ];

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
                      category={
                        presentation?.category
                      }
                      required={
                        presentation?.required
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  {translate("systems.emptyState")}
                </p>
              </div>
            )}

            {/* Password reset */}
            <div className="mx-auto mt-10 w-full max-w-3xl">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 text-center sm:flex-row sm:justify-center sm:text-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-background text-primary">
                  <KeyRound
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  {translate(
                    "systems.passwordReset.label"
                  )}{" "}
                  <a
                    href={PASSWORD_RESET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(
                      "rounded-sm font-semibold text-primary underline-offset-4 hover:underline",
                      focusRing
                    )}
                  >
                    {translate(
                      "systems.passwordReset.linkText"
                    )}
                  </a>
                </p>
              </div>
            </div>
          </>
        ) : null}
      </Container>
    </section>
  );
}