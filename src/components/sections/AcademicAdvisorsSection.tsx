"use client";

import {
  Search,
  Users,
  MessageCircle,
  GraduationCap,
  Loader2,
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
  const [studentLoading, setStudentLoading] = useState(false);
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
      console.error("[ACADEMIC_ADVISOR_STUDENT_SEARCH]", error);

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
        const studentAdvisorName = normalizeSearchText(
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
  }) => (language === "ar" ? advisor.nameAr : advisor.nameEn);

  return (
    <section className="bg-background py-14 sm:py-18 md:py-22">
      <Container className="flex flex-col gap-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {translate("academicAdvisors.heading")}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-foreground/65 sm:text-lg">
            {translate("academicAdvisors.subheading")}
          </p>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {language === "ar"
                      ? "اعرف المرشد الأكاديمي الخاص بك"
                      : "Find Your Academic Advisor"}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-foreground/60">
                    {language === "ar"
                      ? "أدخل الرقم الجامعي لمعرفة بيانات المرشد والفصل الدراسي."
                      : "Enter your Student ID to find your advisor and semester."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className={cx(
                      "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/35",
                      language === "ar" ? "right-4" : "left-4"
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
                      "h-14 w-full rounded-2xl border border-border bg-background text-sm text-foreground shadow-sm outline-none transition",
                      "placeholder:text-foreground/35",
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
                    "inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90",
                    "disabled:cursor-not-allowed disabled:opacity-60",
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

              {studentError && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                  {studentError}
                </div>
              )}

              {studentResult && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="flex items-center gap-3 border-b border-border bg-primary/[0.04] px-5 py-4 sm:px-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap
                        className="h-4.5 w-4.5"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {language === "ar"
                          ? "بيانات الطالب"
                          : "Student Information"}
                      </p>

                      <p className="mt-0.5 text-xs text-foreground/50">
                        {language === "ar"
                          ? "بياناتك الأكاديمية الحالية"
                          : "Your current academic information"}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2">
                    <div className="border-b border-border p-5 sm:border-e sm:px-6">
                      <p className="text-xs font-medium text-foreground/45">
                        {language === "ar"
                          ? "اسم الطالب"
                          : "Student Name"}
                      </p>

                      <p className="mt-2 break-words text-sm font-semibold leading-6 text-foreground sm:text-base">
                        {studentResult.studentName}
                      </p>
                    </div>

                    <div className="border-b border-border p-5 sm:px-6">
                      <p className="text-xs font-medium text-foreground/45">
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

                    <div className="border-b border-border p-5 sm:border-e sm:px-6">
                      <p className="text-xs font-medium text-foreground/45">
                        {language === "ar"
                          ? "الفصل الدراسي"
                          : "Semester"}
                      </p>

                      <p className="mt-2 text-sm font-semibold leading-6 text-foreground sm:text-base">
                        {studentResult.semester}
                      </p>
                    </div>

                    <div className="border-b border-border p-5 sm:px-6">
                      <p className="text-xs font-medium text-foreground/45">
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
                      <p className="text-xs font-medium text-foreground/45">
                        {language === "ar"
                          ? "المرشد الأكاديمي"
                          : "Academic Advisor"}
                      </p>

                      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="break-words text-sm font-semibold leading-6 text-foreground sm:text-base">
                          {matchedAdvisor
                            ? getAdvisorDisplayName(matchedAdvisor)
                            : studentResult.advisorName}
                        </p>

                        {matchedAdvisor && (
                          <a
                            href={`https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(
                              matchedAdvisor.email
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx(
                              "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90",
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
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <button
            type="button"
            onClick={() => {
              setShowAll((current) => !current);
              setSearchQuery("");
            }}
            className={cx(
              "flex min-h-13 w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-foreground shadow-sm transition",
              "hover:bg-background hover:shadow-md",
              focusRing
            )}
          >
            <Users
              className="h-4.5 w-4.5"
              aria-hidden="true"
            />

            {showAll
              ? language === "ar"
                ? "إخفاء قائمة المرشدين"
                : "Hide Advisors"
              : translate("academicAdvisors.allAdvisors")}
          </button>
        </div>

        {showAll && (
          <div className="mx-auto w-full max-w-5xl">
            <div className="relative">
              <Search
                className={cx(
                  "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40",
                  language === "ar" ? "right-4" : "left-4"
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
                  "h-14 w-full rounded-2xl border border-border bg-surface text-foreground shadow-sm outline-none transition",
                  "placeholder:text-foreground/40",
                  "focus:border-primary focus:ring-4 focus:ring-primary/10",
                  language === "ar"
                    ? "pr-12 pl-4"
                    : "pl-12 pr-4"
                )}
              />
            </div>
          </div>
        )}

        {showAll && filteredAdvisors.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAdvisors.map((advisor) => (
              <article
                key={advisor.id}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Users
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-semibold leading-6 text-foreground sm:text-base">
                      {getAdvisorDisplayName(advisor)}
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
                    "mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors",
                    "hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
                    focusRing
                  )}
                >
                  <MessageCircle
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <span className="text-primary">
                    {translate(
                      "academicAdvisors.chatButton"
                    )}
                  </span>
                </a>
              </article>
            ))}
          </div>
        )}

        {showAll &&
          hasSearched &&
          filteredAdvisors.length === 0 && (
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-surface px-5 py-8 text-center text-sm text-foreground/60">
              {translate("academicAdvisors.noResults")}
            </div>
          )}
      </Container>
    </section>
  );
}