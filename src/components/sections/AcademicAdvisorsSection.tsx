"use client";

import { Search, Users, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { academicAdvisors } from "@/data/academicAdvisors";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

export function AcademicAdvisorsSection() {
  const { translate, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdvisors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return academicAdvisors.filter((advisor) =>
      advisor.nameEn.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const hasSearched = searchQuery.trim().length > 0;

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("academicAdvisors.heading")}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("academicAdvisors.subheading")}
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <div className="relative">
            <Search
              className={cx(
                "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50",
                language === "ar" ? "right-4" : "left-4"
              )}
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={translate(
                "academicAdvisors.searchPlaceholder"
              )}
              aria-label={translate(
                "academicAdvisors.searchPlaceholder"
              )}
              className={cx(
                "h-14 w-full rounded-xl border border-border bg-background text-foreground shadow-sm outline-none transition",
                "placeholder:text-foreground/40",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                language === "ar"
                  ? "pr-12 pl-4"
                  : "pl-12 pr-4"
              )}
            />
          </div>
        </div>

        {filteredAdvisors.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAdvisors.map((advisor) => (
              <article
                key={advisor.id}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold leading-6 text-foreground">
                      {advisor.nameEn}
                    </h3>
                  </div>
                </div>

                <a
                  href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
                    advisor.email
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    "mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90",
                    focusRing
                  )}
                >
                  <MessageCircle
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  {translate("academicAdvisors.chatButton")}
                </a>
              </article>
            ))}
          </div>
        ) : hasSearched ? (
          <p className="text-center text-foreground/60">
            {translate("academicAdvisors.noResults")}
          </p>
        ) : null}
      </Container>
    </section>
  );
}