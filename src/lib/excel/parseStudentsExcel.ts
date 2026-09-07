import * as XLSX from "xlsx";
import type { StudentDoc } from "@/lib/firebase/collections";

const REQUIRED_HEADERS = [
  "اسم المرشد الأكاديمي",
  "الرقم الجامعي",
  "اسم الطالب",
  "الفرقة",
] as const;

export interface StudentExcelRow {
  advisorName: string;
  studentId: string;
  studentName: string;
  semester: number;
}

export interface StudentExcelError {
  row: number;
  message: string;
}

export interface StudentExcelParseResult {
  students: StudentExcelRow[];
  errors: StudentExcelError[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeStudentId(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return String(Math.trunc(value));
  }

  return String(value)
    .trim()
    .replace(/\s+/g, "");
}

function normalizeName(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function parseSemester(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const semester = Number(value);

  if (!Number.isInteger(semester)) {
    return null;
  }

  if (semester < 1 || semester > 8) {
    return null;
  }

  return semester;
}

export function parseStudentsExcel(
  file: ArrayBuffer
): StudentExcelParseResult {
  const workbook = XLSX.read(file, {
    type: "array",
  });

  if (workbook.SheetNames.length === 0) {
    return {
      students: [],
      errors: [
        {
          row: 0,
          message: "ملف Excel لا يحتوي على أي Sheet.",
        },
      ],
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
    };
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!worksheet) {
    return {
      students: [],
      errors: [
        {
          row: 0,
          message: "تعذر قراءة أول Sheet في ملف Excel.",
        },
      ],
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
    };
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    worksheet,
    {
      defval: "",
      raw: true,
    }
  );

  if (rows.length === 0) {
    return {
      students: [],
      errors: [
        {
          row: 1,
          message: "ملف Excel لا يحتوي على بيانات.",
        },
      ],
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
    };
  }

  const originalHeaders = Object.keys(rows[0] ?? {});
  const normalizedHeaders = originalHeaders.map(normalizeHeader);

  const missingHeaders = REQUIRED_HEADERS.filter(
    (requiredHeader) =>
      !normalizedHeaders.includes(normalizeHeader(requiredHeader))
  );

  if (missingHeaders.length > 0) {
    return {
      students: [],
      errors: [
        {
          row: 1,
          message: `الأعمدة التالية غير موجودة في الملف: ${missingHeaders.join(
            "، "
          )}`,
        },
      ],
      totalRows: rows.length,
      validRows: 0,
      invalidRows: rows.length,
    };
  }

  const headerMap = new Map<string, string>();

  originalHeaders.forEach((header) => {
    headerMap.set(normalizeHeader(header), header);
  });

  const advisorHeader = headerMap.get("اسم المرشد الأكاديمي");
  const studentIdHeader = headerMap.get("الرقم الجامعي");
  const studentNameHeader = headerMap.get("اسم الطالب");
  const semesterHeader = headerMap.get("الفرقة");

  if (
    !advisorHeader ||
    !studentIdHeader ||
    !studentNameHeader ||
    !semesterHeader
  ) {
    return {
      students: [],
      errors: [
        {
          row: 1,
          message: "تعذر تحديد أعمدة الطلاب بشكل صحيح.",
        },
      ],
      totalRows: rows.length,
      validRows: 0,
      invalidRows: rows.length,
    };
  }

  const students: StudentExcelRow[] = [];
  const errors: StudentExcelError[] = [];
  const studentIds = new Set<string>();

  rows.forEach((row, index) => {
    const excelRowNumber = index + 2;

    const studentId = normalizeStudentId(row[studentIdHeader]);
    const studentName = normalizeName(row[studentNameHeader]);
    const advisorName = normalizeName(row[advisorHeader]);
    const semester = parseSemester(row[semesterHeader]);

    const rowErrors: string[] = [];

    if (!studentId) {
      rowErrors.push("الرقم الجامعي فارغ");
    }

    if (!studentName) {
      rowErrors.push("اسم الطالب فارغ");
    }

    if (!advisorName) {
      rowErrors.push("اسم المرشد الأكاديمي فارغ");
    }

    if (semester === null) {
      rowErrors.push("الفرقة يجب أن تكون رقمًا صحيحًا من 1 إلى 8");
    }

    if (studentId && studentIds.has(studentId)) {
      rowErrors.push(`الرقم الجامعي ${studentId} مكرر`);
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: excelRowNumber,
        message: rowErrors.join(" — "),
      });

      return;
    }

    studentIds.add(studentId);

    students.push({
      studentId,
      studentName,
      advisorName,
      semester: semester as number,
    });
  });

  return {
    students,
    errors,
    totalRows: rows.length,
    validRows: students.length,
    invalidRows: errors.length,
  };
}

export function toStudentDocs(
  students: StudentExcelRow[],
  now: StudentDoc["createdAt"],
  academicTerm: string
): StudentDoc[] {
  return students.map((student) => ({
    studentId: student.studentId,
    studentName: student.studentName,
    advisorName: student.advisorName,
    semester: student.semester,
    academicTerm,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }));
}