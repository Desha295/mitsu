import { NextRequest, NextResponse } from "next/server";
import { requireServerAdmin } from "@/lib/auth/serverAuth";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INVALID_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

export async function POST(request: NextRequest) {
  try {
    await requireServerAdmin(request.headers.get("authorization"));
    const body = await request.json();
    const notificationId = typeof body?.notificationId === "string" ? body.notificationId : "";
    const deliveryId = typeof body?.deliveryId === "string" ? body.deliveryId : "";
    if (!/^[A-Za-z0-9_-]{1,180}$/.test(notificationId) || !/^[0-9a-f-]{36}$/i.test(deliveryId)) {
      return NextResponse.json({ error: "Invalid delivery request" }, { status: 400 });
    }

    const { adminDb, adminMessaging } = getFirebaseAdmin();
    const deliveryRef = adminDb.collection("pushDeliveries").doc(deliveryId);
    const claimed = await adminDb.runTransaction(async (transaction) => {
      const existing = await transaction.get(deliveryRef);
      if (existing.exists) return false;
      transaction.create(deliveryRef, {
        notificationId,
        status: "sending",
        createdAt: new Date(),
      });
      return true;
    });
    if (!claimed) return NextResponse.json({ success: true, duplicate: true });

    const notificationSnapshot = await adminDb.collection("notifications").doc(notificationId).get();
    if (!notificationSnapshot.exists || notificationSnapshot.get("isPublished") !== true) {
      await deliveryRef.update({ status: "skipped", completedAt: new Date() });
      return NextResponse.json({ success: true, sent: 0 });
    }
    const notification = notificationSnapshot.data()!;
    const subscriptions = await adminDb.collection("pushSubscriptions").where("enabled", "==", true).get();
    if (subscriptions.empty) {
      await deliveryRef.update({ status: "sent", sentCount: 0, completedAt: new Date() });
      return NextResponse.json({ success: true, sent: 0 });
    }

    const titleAr = String(notification.titleAr || notification.title || "إشعار جديد").slice(0, 180);
    const titleEn = String(notification.titleEn || notification.title || "New notification").slice(0, 180);
    const bodyAr = String(notification.descriptionAr || notification.description || "").slice(0, 500);
    const bodyEn = String(notification.descriptionEn || notification.description || "").slice(0, 500);
    const rawHref = typeof notification.href === "string" ? notification.href : "/";
    const href = rawHref.startsWith("/") && !rawHref.startsWith("//") ? rawHref : "/";
    const tokens = subscriptions.docs.map((doc) => String(doc.get("token") || ""));
    let sentCount = 0;
    const invalidIds: string[] = [];

    for (let offset = 0; offset < subscriptions.docs.length; offset += 500) {
      const docs = subscriptions.docs.slice(offset, offset + 500);
      const chunkTokens = tokens.slice(offset, offset + 500);
      const result = await adminMessaging.sendEachForMulticast({
        tokens: chunkTokens,
        data: {
          notificationId,
          titleAr,
          titleEn,
          bodyAr,
          bodyEn,
          href,
        },
        webpush: { headers: { Urgency: "high" } },
      });
      sentCount += result.successCount;
      result.responses.forEach((item, index) => {
        if (item.error && INVALID_TOKEN_CODES.has(item.error.code || "")) {
          invalidIds.push(docs[index].id);
        }
      });
    }

    if (invalidIds.length) {
      const batch = adminDb.batch();
      invalidIds.forEach((id) => batch.delete(adminDb.collection("pushSubscriptions").doc(id)));
      await batch.commit();
    }
    await deliveryRef.update({ status: "sent", sentCount, invalidCount: invalidIds.length, completedAt: new Date() });
    return NextResponse.json({ success: true, sent: sentCount });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    console.error("[MITSU] Push delivery failed:", message);
    return NextResponse.json({ error: "Push delivery failed" }, { status });
  }
}
