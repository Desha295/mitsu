"use client";

import {
  Search,
  Users,
  MessageCircle,
  GraduationCap,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { Container } from "@/components/layout/Container";
import { academicAdvisors } from "@/data/academicAdvisors";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";
import { db } from "@/lib/firebase/config";
import {
  COLLECTIONS,
  type StudentDoc,
} from "@/lib/firebase/collections";

function normalizeSearchText(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\s+/g, " ");
}

export function AcademicAdvisorsSection() {
  const { translate, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [studentLoading, setStudentLoading] =
    useState(false);
  const [studentResult, setStudentResult] =
    useState<StudentDoc | null>(null);
  const [studentError, setStudentError] = useState("");

  const filteredAdvisors = useMemo(() => {
    const query = normalizeSearchText(searchQuery);

    if (!query) {
      return showAll ? academicAdvisors : [];
    }

    return academicAdvisors.filter((advisor) =>
      [advisor.nameAr, advisor.nameEn].some((name) =>
        normalizeSearchText(name).includes(query)
      )
    );
  }, [searchQuery, showAll]);

  const hasSearched = searchQuery.trim().length > 0;

  async function handleStudentSearch() {
    const normalizedStudentId = studentId
      .trim()
      .replace(/\s+/g, "");

    if (!normalizedStudentId) {
      setStudentError(
        language === "ar"
          ? "يرجى إدخال الرقم الجامعي."
          : "Please enter your Student ID."
      );
      setStudentResult(null);
      return;
    }

    if (!db) {
      setStudentError(
        language === "ar"
          ? "تعذر الاتصال بقاعدة البيانات حاليًا."
          : "Unable to connect to the database right now."
      );
      setStudentResult(null);
      return;
    }

    try {
      setStudentLoading(true);
      setStudentError("");
      setStudentResult(null);

      const studentRef = doc(
        db,
        COLLECTIONS.students,
        normalizedStudentId
      );

      const snapshot = await getDoc(studentRef);

      if (!snapshot.exists()) {
        setStudentError(
          language === "ar"
            ? "لم يتم العثور على طالب بهذا الرقم الجامعي."
            : "No student was found with this Student ID."
        );
        return;
      }

      const data = snapshot.data() as StudentDoc;

      if (data.isActive === false) {
        setStudentError(
          language === "ar"
            ? "بيانات هذا الطالب غير متاحة حاليًا."
            : "This student's data is currently unavailable."
        );
        return;
      }

      setStudentResult(data);
    } catch (error) {
      console.error(
        "[ACADEMIC_ADVISOR_STUDENT_SEARCH]",
        error
      );

      setStudentError(
        language === "ar"
          ? "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى."
          : "An error occurred while searching. Please try again."
      );
    } finally {
      setStudentLoading(false);
    }
  }

  const matchedAdvisor = studentResult
    ? academicAdvisors.find((advisor) => {
        const studentAdvisorName =
          normalizeSearchText(
            studentResult.advisorName
          );

        return (
          normalizeSearchText(advisor.nameAr) ===
            studentAdvisorName ||
          normalizeSearchText(advisor.nameEn) ===
            studentAdvisorName
        );
      })
    : null;

  const getAdvisorDisplayName = (advisor: {
    nameAr: string;
    nameEn: string;
  }) =>
    language === "ar"
      ? advisor.nameAr
      : advisor.nameEn;

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
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
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <GraduationCap
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              {translate(
                "academicAdvisors.heading"
              )}
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {translate(
              "academicAdvisors.heading"
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {translate(
              "academicAdvisors.subheading"
            )}
          </p>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <div
            className={[
              "relative overflow-hidden rounded-[2rem]",
              "border border-border/70",
              "bg-surface/80 backdrop-blur-xl",
              "shadow-xl shadow-primary/5",
            ].join(" ")}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            <div className="border-b border-border/70 px-5 py-6 sm:px-8 sm:py-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary">
                  <GraduationCap
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                      Student Lookup
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                    {language === "ar"
                      ? "اعرف المرشد الأكاديمي الخاص بك"
                      : "Find Your Academic Advisor"}
                  </h2>

                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {language === "ar"
                      ? "أدخل الرقم الجامعي لمعرفة بيانات المرشد والفصل الدراسي."
                      : "Enter your Student ID to find your advisor and academic information."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className={cx(
                      "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground",
                      language === "ar"
                        ? "right-4"
                        : "left-4"
                    )}
                    aria-hidden="true"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    value={studentId}
                    onChange={(event) => {
                      setStudentId(event.target.value);
                      setStudentError("");
                      setStudentResult(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleStudentSearch();
                      }
                    }}
                    placeholder={
                      language === "ar"
                        ? "أدخل الرقم الجامعي"
                        : "Enter Student ID"
                    }
                    aria-label={
                      language === "ar"
                        ? "الرقم الجامعي"
                        : "Student ID"
                    }
                    className={cx(
                      "h-14 w-full rounded-2xl border border-border/70 bg-background text-sm text-foreground shadow-sm outline-none transition",
                      "placeholder:text-muted-foreground/60",
                      "focus:border-primary focus:ring-4 focus:ring-primary/10",
                      language === "ar"
                        ? "pr-12 pl-4"
                        : "pl-12 pr-4"
                    )}
                    dir="ltr"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStudentSearch}
                  disabled={studentLoading}
                  className={cx(
                    [
                      "inline-flex h-14 shrink-0 items-center justify-center gap-2",
                      "rounded-2xl bg-primary px-7",
                      "text-sm font-semibold text-primary-foreground",
                      "shadow-sm transition-all duration-200",
                      "hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/15",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                    ].join(" "),
                    focusRing
                  )}
                >
                  {studentLoading ? (
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Search
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  )}

                  {studentLoading
                    ? language === "ar"
                      ? "جاري البحث..."
                      : "Searching..."
                    : language === "ar"
                      ? "بحث"
                      : "Search"}
                </button>
              </div>

              {studentError ? (
                <div
                  role="alert"
                  className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                >
                  {studentError}
                </div>
              ) : null}

              {studentResult ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-background">
                  <div className="flex items-center gap-3 border-b border-border/70 bg-primary/[0.04] px-5 py-4 sm:px-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                      <GraduationCap
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {language === "ar"
                          ? "بيانات الطالب"
                          : "Student Information"}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {language === "ar"
                          ? "بياناتك الأكاديمية الحالية"
                          : "Your current academic information"}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2">
                    <div className="border-b border-border/70 p-5 sm:border-e sm:px-6">
                      <p className="text-xs font-medium text-muted-foreground">
                        {language === "ar"
                          ? "اسم الطالب"
                          : "Student Name"}
                      </p>

                      <p className="mt-2 break-words text-sm font-semibold leading-6 text-foreground sm:text-base">
                        {studentResult.studentName}
                      </p>
                    </div>

                    <div className="border-b border-border/70 p-5 sm:px-6">
                      <p className="text-xs font-medium text-muted-foreground">
                        {language === "ar"
                          ? "الرقم الجامعي"
                          : "Student ID"}
                      </p>

                      <p
                        className="mt-2 text-sm font-semibold leading-6 text-foreground sm:text-base"
                        dir="ltr"
                      >
                        {studentResult.studentId}
                      </p>
                    </div>

                    <div className="border-b border-border/70 p-5 sm:border-e sm:px-6">
                      <p className="text-xs font-medium text-muted-foreground">
                        {language === "ar"
                          ? "الفصل الدراسي"
                          : "Semester"}
                      </p>

                      <p className="mt-2 text-sm font-semibold leading-6 text-foreground sm:text-base">
                        {studentResult.semester}
                      </p>
                    </div>

                    <div className="border-b border-border/70 p-5 sm:px-6">
                      <p className="text-xs font-medium text-muted-foreground">
                        {language === "ar"
                          ? "الترم الدراسي"
                          : "Academic Term"}
                      </p>

                      <p
                        className="mt-2 text-sm font-semibold leading-6 text-foreground sm:text-base"
                        dir="ltr"
                      >
                        {studentResult.academicTerm}
                      </p>
                    </div>

                    <div className="p-5 sm:col-span-2 sm:px-6">
                      <p className="text-xs font-medium text-muted-foreground">
                        {language === "ar"
                          ? "المرشد الأكاديمي"
                          : "Academic Advisor"}
                      </p>

                      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="break-words text-sm font-semibold leading-6 text-foreground sm:text-base">
                          {matchedAdvisor
                            ? getAdvisorDisplayName(
                                matchedAdvisor
                              )
                            : studentResult.advisorName}
                        </p>

                        {matchedAdvisor ? (
                          <a
                            href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
                              matchedAdvisor.email
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx(
                              [
                                "inline-flex min-h-11 shrink-0 items-center justify-center gap-2",
                                "rounded-xl bg-primary px-5 py-2.5",
                                "text-sm font-semibold text-primary-foreground",
                                "shadow-sm transition-all duration-200",
                                "hover:-translate-y-0.5 hover:shadow-md",
                              ].join(" "),
                              focusRing
                            )}
                          >
                            <MessageCircle
                              className="h-4 w-4"
                              aria-hidden="true"
                            />

                            {translate(
                              "academicAdvisors.chatButton"
                            )}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-4xl">
          <button
            type="button"
            onClick={() => {
              setShowAll((current) => !current);
              setSearchQuery("");
            }}
            className={cx(
              [
                "group flex min-h-14 w-full items-center justify-center gap-2.5",
                "rounded-2xl border border-border/70",
                "bg-surface/80 px-5 py-3.5",
                "text-sm font-semibold text-foreground",
                "shadow-sm backdrop-blur-xl",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-primary/20",
                "hover:bg-primary/5 hover:text-primary hover:shadow-md",
              ].join(" "),
              focusRing
            )}
          >
            <Users
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            />

            {showAll
              ? language === "ar"
                ? "إخفاء قائمة المرشدين"
                : "Hide Advisors"
              : translate(
                  "academicAdvisors.allAdvisors"
                )}
          </button>
        </div>

        {showAll ? (
          <>
            <div className="mx-auto mt-5 w-full max-w-5xl">
              <div className="relative">
                <Search
                  className={cx(
                    "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground",
                    language === "ar"
                      ? "right-4"
                      : "left-4"
                  )}
                  aria-hidden="true"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder={translate(
                    "academicAdvisors.searchPlaceholder"
                  )}
                  aria-label={translate(
                    "academicAdvisors.searchPlaceholder"
                  )}
                  className={cx(
                    "h-14 w-full rounded-2xl border border-border/70 bg-surface text-foreground shadow-sm outline-none transition",
                    "placeholder:text-muted-foreground/60",
                    "focus:border-primary focus:ring-4 focus:ring-primary/10",
                    language === "ar"
                      ? "pr-12 pl-4"
                      : "pl-12 pr-4"
                  )}
                />
              </div>
            </div>

            {filteredAdvisors.length > 0 ? (
              <div className="mx-auto mt-6 grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAdvisors.map((advisor) => (
                  <article
                    key={advisor.id}
                    className={[
                      "group relative flex flex-col overflow-hidden",
                      "rounded-3xl border border-border/70",
                      "bg-surface/80 p-5 backdrop-blur-xl",
                      "shadow-sm",
                      "transition-all duration-300",
                      "hover:-translate-y-1",
                      "hover:border-primary/25",
                      "hover:shadow-xl hover:shadow-primary/5",
                    ].join(" ")}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary transition-colors duration-200 group-hover:bg-primary/10">
                        <Users
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                          Academic Advisor
                        </p>

                        <h3 className="break-words text-sm font-semibold leading-6 text-foreground sm:text-base">
                          {getAdvisorDisplayName(
                            advisor
                          )}
                        </h3>
                      </div>

                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-primary/30 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </div>

                    <a
                      href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
                        advisor.email
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cx(
                        [
                          "mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2",
                          "rounded-xl border border-primary/20",
                          "bg-primary/5 px-4 py-2.5",
                          "text-sm font-semibold text-primary",
                          "transition-all duration-200",
                          "hover:border-primary/30 hover:bg-primary/10",
                        ].join(" "),
                        focusRing
                      )}
                    >
                      <MessageCircle
                        className="h-4 w-4"
                        aria-hidden="true"
                      />

                      {translate(
                        "academicAdvisors.chatButton"
                      )}
                    </a>
                  </article>
                ))}
              </div>
            ) : null}

            {hasSearched &&
            filteredAdvisors.length === 0 ? (
              <div className="mx-auto mt-6 w-full max-w-2xl rounded-3xl border border-dashed border-border bg-surface/50 px-5 py-10 text-center">
                <Users
                  className="mx-auto mb-3 h-6 w-6 text-muted-foreground"
                  aria-hidden="true"
                />

                <p className="text-sm text-muted-foreground">
                  {translate(
                    "academicAdvisors.noResults"
                  )}
                </p>
              </div>
            ) : null}
          </>
        ) : null}
      </Container>
    </section>
  );
}
