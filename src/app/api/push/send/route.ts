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
  let stage = "admin-auth";
  try {
    await requireServerAdmin(request.headers.get("authorization"));
    stage = "request-validation";
    const body = await request.json();
    const notificationId = typeof body?.notificationId === "string" ? body.notificationId : "";
    const deliveryId = typeof body?.deliveryId === "string" ? body.deliveryId : "";
    if (!/^[A-Za-z0-9_-]{1,180}$/.test(notificationId) || !/^[0-9a-f-]{36}$/i.test(deliveryId)) {
      return NextResponse.json({ error: "Invalid delivery request" }, { status: 400 });
    }

    stage = "firebase-admin-init";
    const { adminDb, adminMessaging } = getFirebaseAdmin();
    stage = "delivery-claim";
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

    stage = "notification-read";
    const notificationSnapshot = await adminDb.collection("notifications").doc(notificationId).get();
    if (!notificationSnapshot.exists || notificationSnapshot.get("isPublished") !== true) {
      await deliveryRef.update({ status: "skipped", completedAt: new Date() });
      return NextResponse.json({ success: true, sent: 0 });
    }
    const notification = notificationSnapshot.data()!;
    stage = "subscription-query";
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
    const failureCodes: Record<string, number> = {};

    for (let offset = 0; offset < subscriptions.docs.length; offset += 500) {
      stage = "fcm-send";
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
        if (item.error) {
          const code = item.error.code || "messaging/unknown-error";
          failureCodes[code] = (failureCodes[code] || 0) + 1;
          if (INVALID_TOKEN_CODES.has(code)) invalidIds.push(docs[index].id);
        }
      });
    }

    if (invalidIds.length) {
      stage = "invalid-subscription-cleanup";
      const batch = adminDb.batch();
      invalidIds.forEach((id) => batch.delete(adminDb.collection("pushSubscriptions").doc(id)));
      await batch.commit();
    }
    stage = "delivery-record-update";
    await deliveryRef.update({ status: "sent", sentCount, invalidCount: invalidIds.length, completedAt: new Date() });
    if (Object.keys(failureCodes).length) {
      console.error("[MITSU] Push delivery had FCM failures", { stage: "fcm-send", failureCodes, sentCount, subscriptionCount: subscriptions.size });
    }
    return NextResponse.json({ success: true, sent: sentCount, failed: subscriptions.size - sentCount, failureCodes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    const code = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code || "UNKNOWN")
      : message === "UNAUTHORIZED" || message === "FORBIDDEN" ? message : "UNKNOWN";
    console.error("[MITSU] Push delivery failed", { stage, code });
    return NextResponse.json({ error: "Push delivery failed", stage, code }, { status });
  }
}
