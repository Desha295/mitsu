import { NextRequest, NextResponse } from "next/server";
import { parseStudentsExcel } from "@/lib/excel/parseStudentsExcel";
import { requireServerAdmin } from "@/lib/auth/serverAuth";
export const dynamic = "force-dynamic";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    await requireServerAdmin(request.headers.get("authorization"));

    const body = await request.json();

    const url =
      typeof body?.url === "string"
        ? body.url.trim()
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

    return NextResponse.json({
      success: true,
      stats: {
        totalRows: result.totalRows,
        validRows: result.validRows,
        invalidRows: result.invalidRows,
      },
      preview: result.students.slice(0, 20),
      errors: result.errors.slice(0, 50),
      hasMoreErrors: result.errors.length > 50,
    });
  } catch (error) {
    console.error("[STUDENTS_PREVIEW]", error);

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
        message: "حدث خطأ أثناء قراءة ملف Excel.",
      },
      { status: 500 }
    );
  }
}

function isAllowedSpreadsheetHost(hostname: string) {
  return hostname === "firebasestorage.googleapis.com" ||
    hostname === "storage.googleapis.com";
}
