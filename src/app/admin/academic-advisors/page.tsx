"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface StudentPreview {
  studentId: string;
  studentName: string;
  advisorName: string;
  semester: number;
}

interface PreviewResponse {
  success: boolean;
  message?: string;
  stats?: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
  preview?: StudentPreview[];
  errors?: {
    row: number;
    message: string;
  }[];
  hasMoreErrors?: boolean;
}

interface ImportResponse {
  success: boolean;
  message: string;
  stats?: {
    importedCount: number;
    updatedCount: number;
    totalStudents: number;
  };
}

export default function AcademicAdvisorsPage() {
  const { user } = useAuth();

  const [excelUrl, setExcelUrl] = useState("");
  const [academicTerm, setAcademicTerm] = useState("Fall 2026 - 2027");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<PreviewResponse | null>(null);
  const [importResult, setImportResult] =
    useState<ImportResponse | null>(null);

  async function handlePreview() {
    if (!excelUrl.trim()) {
      setResult({
        success: false,
        message: "يرجى إدخال رابط ملف Excel.",
      });
      return;
    }

    if (!user) {
      setResult({
        success: false,
        message: "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.",
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setImportResult(null);

      const idToken = await user.getIdToken();

      const response = await fetch("/api/admin/students/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          url: excelUrl.trim(),
        }),
      });

      const data = (await response.json()) as PreviewResponse;

      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        message: "حدث خطأ أثناء الاتصال بالخادم.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (!excelUrl.trim()) {
      setImportResult({
        success: false,
        message: "يرجى إدخال رابط ملف Excel.",
      });
      return;
    }

    if (!academicTerm) {
      setImportResult({
        success: false,
        message: "يرجى اختيار الترم الدراسي.",
      });
      return;
    }

    if (!user) {
      setImportResult({
        success: false,
        message:
          "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.",
      });
      return;
    }

    if (
      !result?.success ||
      !result.stats ||
      result.stats.invalidRows > 0 ||
      result.stats.validRows === 0
    ) {
      setImportResult({
        success: false,
        message:
          "يجب عمل Preview ناجح والتأكد من عدم وجود أخطاء قبل الاستيراد.",
      });
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد من استيراد ${result.stats.validRows} طالب إلى ${academicTerm}؟`
    );

    if (!confirmed) {
      return;
    }

    try {
      setImporting(true);
      setImportResult(null);

      const idToken = await user.getIdToken();

      const response = await fetch("/api/admin/students/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          url: excelUrl.trim(),
          academicTerm,
        }),
      });

      const data = (await response.json()) as ImportResponse;

      setImportResult(data);
    } catch (error) {
      console.error(error);

      setImportResult({
        success: false,
        message: "حدث خطأ أثناء استيراد البيانات.",
      });
    } finally {
      setImporting(false);
    }
  }

  const stats = result?.stats;

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Academic Advisors</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          تحديث بيانات الطلاب والمرشدين الأكاديميين من ملف Excel.
        </p>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="excel-url"
              className="text-sm font-medium"
            >
              رابط ملف Excel
            </label>

            <input
              id="excel-url"
              type="url"
              value={excelUrl}
              onChange={(event) => setExcelUrl(event.target.value)}
              placeholder="https://example.com/advisors_students.xlsx"
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2"
              dir="ltr"
            />

            <p className="text-xs text-muted-foreground">
              استخدم رابط مباشر لتحميل ملف Excel بصيغة XLSX.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="academic-term"
              className="text-sm font-medium"
            >
              الترم الدراسي
            </label>

            <select
              id="academic-term"
              value={academicTerm}
              onChange={(event) => setAcademicTerm(event.target.value)}
              className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2"
            >
              <option value="Fall 2026-2027">Fall 2026 - 2027</option>
              <option value="Spring 2027">Spring 2027 </option>
              <option value="Summer 2027">Summer 2027 </option>
              <option value="Fall 2027">Fall 2027-2028</option>
              <option value="Spring 2028">Spring 2028 </option>
              <option value="Summer 2028">Summer 2028 </option>
            </select>

            <p className="text-xs text-muted-foreground">
              سيتم حفظ الترم مع بيانات الطلاب التي يتم استيرادها.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePreview}
          disabled={loading || importing}
          className="mt-5 rounded-xl px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "جاري قراءة الملف..." : "معاينة الملف"}
        </button>
      </section>

      {result && !result.success && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <p className="font-medium">
            {result.message ?? "حدث خطأ غير متوقع."}
          </p>
        </section>
      )}

      {result?.success && stats && (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="إجمالي الصفوف"
              value={stats.totalRows}
            />

            <StatCard
              label="صفوف صحيحة"
              value={stats.validRows}
            />

            <StatCard
              label="صفوف بها أخطاء"
              value={stats.invalidRows}
            />
          </section>

          {result.errors && result.errors.length > 0 && (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
              <div className="mb-4">
                <h2 className="font-semibold text-red-700 dark:text-red-300">
                  أخطاء الملف
                </h2>

                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  يجب تصحيح الأخطاء في Excel وإعادة المعاينة قبل الاستيراد.
                </p>
              </div>

              <div className="space-y-2">
                {result.errors.map((error) => (
                  <div
                    key={`${error.row}-${error.message}`}
                    className="rounded-xl border bg-background p-3 text-sm"
                  >
                    <span className="font-semibold">
                      الصف {error.row}:
                    </span>{" "}
                    {error.message}
                  </div>
                ))}
              </div>

              {result.hasMoreErrors && (
                <p className="mt-4 text-xs text-red-600 dark:text-red-400">
                  توجد أخطاء إضافية لم يتم عرضها.
                </p>
              )}
            </section>
          )}

          {result.preview && result.preview.length > 0 && (
            <section className="rounded-2xl border bg-card shadow-sm">
              <div className="border-b p-5">
                <h2 className="font-semibold">معاينة الطلاب</h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  يتم عرض أول 20 طالبًا فقط للمعاينة.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-4 py-3 text-start">
                        الرقم الجامعي
                      </th>

                      <th className="px-4 py-3 text-start">
                        اسم الطالب
                      </th>

                      <th className="px-4 py-3 text-start">
                        المرشد الأكاديمي
                      </th>

                      <th className="px-4 py-3 text-start">
                        الفصل الدراسي
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.preview.map((student) => (
                      <tr
                        key={student.studentId}
                        className="border-b last:border-b-0"
                      >
                        <td
                          className="px-4 py-3 font-mono"
                          dir="ltr"
                        >
                          {student.studentId}
                        </td>

                        <td className="px-4 py-3">
                          {student.studentName}
                        </td>

                        <td className="px-4 py-3">
                          {student.advisorName}
                        </td>

                        <td className="px-4 py-3">
                          {student.semester}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {stats.invalidRows === 0 && stats.validRows > 0 && (
            <section className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
              <h2 className="font-semibold text-green-700 dark:text-green-300">
                الملف جاهز للاستيراد
              </h2>

              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                جميع الصفوف صحيحة ويمكن الآن إضافتها إلى قاعدة البيانات.
              </p>

              <button
                type="button"
                onClick={handleImport}
                disabled={importing}
                className="mt-4 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing
                  ? "جاري استيراد الطلاب..."
                  : "استيراد الطلاب"}
              </button>

              <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                الترم المحدد: {academicTerm}
              </p>
            </section>
          )}
        </>
      )}

      {importResult && (
        <section
          className={`rounded-2xl border p-5 ${
            importResult.success
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
          }`}
        >
          <h2
            className={`font-semibold ${
              importResult.success
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {importResult.success
              ? "تم الاستيراد بنجاح"
              : "فشل الاستيراد"}
          </h2>

          <p
            className={`mt-1 text-sm ${
              importResult.success
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {importResult.message}
          </p>

          {importResult.success && importResult.stats && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ResultStat
                label="طلاب جدد"
                value={importResult.stats.importedCount}
              />

              <ResultStat
                label="طلاب تم تحديثهم"
                value={importResult.stats.updatedCount}
              />

              <ResultStat
                label="إجمالي الطلاب"
                value={importResult.stats.totalStudents}
              />
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-2 text-3xl font-bold">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-background/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-2xl font-bold">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}