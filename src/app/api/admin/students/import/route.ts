import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { parseStudentsExcel } from "@/lib/excel/parseStudentsExcel";
import { requireServerAdmin } from "@/lib/auth/serverAuth";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BATCH_SIZE = 450;

export async function POST(request: NextRequest) {
  try {
    await requireServerAdmin(request.headers.get("authorization"));
    const { adminDb } = getFirebaseAdmin();

    const body = await request.json();

    const url =
      typeof body?.url === "string"
        ? body.url.trim()
        : "";

    const academicTerm =
      typeof body?.academicTerm === "string"
        ? body.academicTerm.trim()
        : "";

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "يرجى إدخال رابط ملف Excel.",
        },
        { status: 400 }
      );
    }

    if (!academicTerm) {
      return NextResponse.json(
        {
          success: false,
          message: "يرجى اختيار الترم الدراسي.",
        },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "رابط Excel غير صحيح.",
        },
        { status: 400 }
      );
    }

    if (parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        {
          success: false,
          message: "يجب أن يكون رابط الملف باستخدام HTTPS.",
        },
        { status: 400 }
      );
    }

    if (!isAllowedSpreadsheetHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { success: false, message: "رابط الملف يجب أن يكون من Firebase Storage أو Google Cloud Storage." },
        { status: 400 }
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `تعذر تحميل الملف. HTTP ${response.status}`,
        },
        { status: 400 }
      );
    }

    const contentLength = response.headers.get("content-length");

    if (
      contentLength &&
      Number(contentLength) > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "حجم ملف Excel أكبر من الحد المسموح به (10 MB).",
        },
        { status: 400 }
      );
    }

    const buffer = await response.arrayBuffer();

    if (buffer.byteLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "حجم ملف Excel أكبر من الحد المسموح به (10 MB).",
        },
        { status: 400 }
      );
    }

    const result = parseStudentsExcel(buffer);

    if (result.errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "لا يمكن استيراد الملف قبل تصحيح جميع الأخطاء.",
          stats: {
            totalRows: result.totalRows,
            validRows: result.validRows,
            invalidRows: result.invalidRows,
          },
          errors: result.errors.slice(0, 50),
          hasMoreErrors: result.errors.length > 50,
        },
        { status: 400 }
      );
    }

    if (result.students.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "لا توجد بيانات طلاب صالحة للاستيراد.",
        },
        { status: 400 }
      );
    }

    const studentsCollection = adminDb.collection(
      COLLECTIONS.students
    );

    const studentRefs = result.students.map((student) =>
      studentsCollection.doc(student.studentId)
    );

    const existingSnapshots = [];

    for (let i = 0; i < studentRefs.length; i += BATCH_SIZE) {
      const chunk = studentRefs.slice(i, i + BATCH_SIZE);

      const snapshots = await adminDb.getAll(...chunk);

      existingSnapshots.push(...snapshots);
    }

    const existingCreatedAt = new Map<string, Timestamp>();

    existingSnapshots.forEach((snapshot) => {
      if (!snapshot.exists) {
        return;
      }

      const data = snapshot.data();

      if (data?.createdAt instanceof Timestamp) {
        existingCreatedAt.set(snapshot.id, data.createdAt);
      }
    });

    const now = Timestamp.now();

    let importedCount = 0;
    let updatedCount = 0;

    for (
      let start = 0;
      start < result.students.length;
      start += BATCH_SIZE
    ) {
      const chunk = result.students.slice(
        start,
        start + BATCH_SIZE
      );

      const batch = adminDb.batch();

      chunk.forEach((student) => {
        const ref = studentsCollection.doc(student.studentId);

        const alreadyExists = existingCreatedAt.has(
          student.studentId
        );

        const createdAt =
          existingCreatedAt.get(student.studentId) ?? now;

        const studentData = {
          studentId: student.studentId,
          studentName: student.studentName,
          advisorName: student.advisorName,
          semester: student.semester,
          academicTerm,
          isActive: true,
          createdAt,
          updatedAt: now,
        };

        batch.set(ref, studentData, {
          merge: true,
        });

        if (alreadyExists) {
          updatedCount++;
        } else {
          importedCount++;
        }
      });

      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: "تم استيراد بيانات الطلاب بنجاح.",
      stats: {
        totalRows: result.totalRows,
        importedCount,
        updatedCount,
        totalStudents: result.students.length,
        academicTerm,
      },
    });
  } catch (error) {
    console.error("[STUDENTS_IMPORT]", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            message: "غير مصرح. يرجى تسجيل الدخول.",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "ليس لديك صلاحية لإدارة بيانات الطلاب.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء استيراد بيانات الطلاب.",
      },
      { status: 500 }
    );
  }
}

function isAllowedSpreadsheetHost(hostname: string) {
  return hostname === "firebasestorage.googleapis.com" ||
    hostname === "storage.googleapis.com";
}
