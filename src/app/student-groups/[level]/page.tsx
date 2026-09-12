"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Users,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { studentGroupsService } from "@/lib/firebase/services";
import { cx } from "@/lib/utils";

interface StudentGroupsLevelPageProps {
  params: Promise<{
    level: string;
  }>;
}

const LEVELS = {
  1: {
    ar: "الفرقة الأولى",
    en: "Level 1",
  },
  2: {
    ar: "الفرقة الثانية",
    en: "Level 2",
  },
  3: {
    ar: "الفرقة الثالثة",
    en: "Level 3",
  },
  4: {
    ar: "الفرقة الرابعة",
    en: "Level 4",
  },
} as const;

export default function StudentGroupsLevelPage({
  params,
}: StudentGroupsLevelPageProps) {
  const { level } = use(params);

  const levelNumber = Number(
    level.replace("level-", "")
  ) as 1 | 2 | 3 | 4;

  if (
    !level.startsWith("level-") ||
    ![1, 2, 3, 4].includes(levelNumber)
  ) {
    return null;
  }

  return <StudentGroupsContent level={levelNumber} />;
}

function StudentGroupsContent({
  level,
}: {
  level: 1 | 2 | 3 | 4;
}) {
  const { translate, language } = useLanguage();

  const queryOptions = useMemo(
    () => ({
      filters: [
        {
          field: "isActive",
          op: "==" as const,
          value: true,
        },
        {
          field: "level",
          op: "==" as const,
          value: level,
        },
      ],
      orderByField: {
        field: "order",
        direction: "asc" as const,
      },
    }),
    [level]
  );

  const { data: groups, loading, error } = useFirestoreList(
    studentGroupsService,
    queryOptions
  );

  const levelInfo = LEVELS[level];

  const title = language === "ar" ? levelInfo.ar : levelInfo.en;

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-6 w-32 animate-pulse rounded-full bg-surface-muted" />

            <div className="mx-auto mt-5 h-12 w-72 animate-pulse rounded-2xl bg-surface-muted" />

            <div className="mx-auto mt-4 h-5 w-full max-w-xl animate-pulse rounded-xl bg-surface-muted" />
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={cx(
                  "h-64 w-full animate-pulse rounded-[2rem] bg-surface-muted",
                  "sm:w-[calc(50%-0.625rem)]",
                  "lg:w-[calc(33.333%-0.833rem)]"
                )}
              />
            ))}
          </div>
        </Container>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen bg-background py-20">
        <Container>
          <div className="mx-auto max-w-xl rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <h1 className="text-xl font-bold text-foreground">
              {language === "ar"
                ? "حدث خطأ أثناء تحميل الجروبات"
                : "Something went wrong while loading the groups"}
            </h1>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {language === "ar"
                ? "حاول تحديث الصفحة مرة أخرى."
                : "Please refresh the page and try again."}
            </p>
          </div>
        </Container>
      </main>
    );
  }

  const firstCategoryGroups = groups.slice(0, 2);
  const remainingGroups = groups.slice(2);

  const remainingRows: (typeof groups)[] = [];

  for (let i = 0; i < remainingGroups.length; i += 3) {
    remainingRows.push(remainingGroups.slice(i, i + 3));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/student-groups"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-xl transition-colors hover:border-primary/30 hover:text-primary"
          >
            {language === "ar" ? (
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            )}

            {language === "ar"
              ? "جروبات الطلاب"
              : "Student Groups"}
          </Link>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {language === "ar"
              ? "اختار الجروب المناسب للوصول إلى مجتمع دفعتك والتواصل مع زملائك."
              : "Choose the appropriate group to connect with your batch community and classmates."}
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="mx-auto mt-14 max-w-xl rounded-[2rem] border border-border/70 bg-surface/70 p-10 text-center shadow-xl backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-7 w-7" aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-foreground">
              {language === "ar"
                ? "لا توجد جروبات متاحة حاليًا"
                : "No groups available"}
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {language === "ar"
                ? "سيتم إضافة الجروبات هنا عند توفرها."
                : "Groups will appear here once they become available."}
            </p>
          </div>
        ) : (
          <div className="mt-14 space-y-6">
            {/* First row: first two cards only */}
            {firstCategoryGroups.length > 0 && (
              <div className="flex flex-wrap justify-center gap-5">
                {firstCategoryGroups.map((group) => (
                  <StudentGroupCard
                    key={group.id}
                    group={group}
                    language={language}
                  />
                ))}
              </div>
            )}

            {/* Remaining rows: maximum 3 cards per row */}
            {remainingRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="flex flex-wrap justify-center gap-5"
              >
                {row.map((group) => (
                  <StudentGroupCard
                    key={group.id}
                    group={group}
                    language={language}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}

function StudentGroupCard({
  group,
  language,
}: {
  group: {
    id: string;
    nameAr: string;
    nameEn: string;
    descriptionAr?: string;
    descriptionEn?: string;
    whatsappUrl: string;
    order: number;
    isActive: boolean;
  };
  language: string;
}) {
  const name = language === "ar" ? group.nameAr : group.nameEn;

  const description =
    language === "ar"
      ? group.descriptionAr
      : group.descriptionEn;

  return (
    <div
      className={cx(
        "group relative w-full overflow-hidden rounded-[2rem]",
        "border border-border/70 bg-surface/70",
        "p-7 shadow-lg shadow-primary/[0.03]",
        "backdrop-blur-xl",
        "transition-all duration-500",
        "hover:-translate-y-1",
        "hover:border-primary/30",
        "hover:shadow-2xl hover:shadow-primary/10",
        "sm:w-[calc(50%-0.625rem)]",
        "lg:w-[calc(33.333%-0.833rem)]"
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
            <MessageCircle
              className="h-7 w-7"
              aria-hidden="true"
            />
          </div>

          <div className="rounded-full border border-border/70 bg-surface-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            WhatsApp
          </div>
        </div>

        <h2 className="mt-7 text-xl font-bold text-foreground sm:text-2xl">
          {name}
        </h2>

        {description ? (
          <p className="mt-3 min-h-[3.5rem] text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        ) : (
          <div className="min-h-[3.5rem]" />
        )}

        <a
          href={group.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:brightness-110"
        >
          <span>
            {language === "ar"
              ? "انضم للجروب"
              : "Join Group"}
          </span>

          <ExternalLink
            className="h-4 w-4"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}