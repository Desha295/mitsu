"use client";

import { auth } from "@/lib/firebase/auth";

/** Push delivery is best-effort; the existing Firestore notification remains authoritative. */
export async function requestPushDelivery(
  notificationId: string
) {
  const user = auth?.currentUser;
  if (!user) return;
  try {
    const response = await fetch("/api/push/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId,
        deliveryId: crypto.randomUUID(),
      }),
    });
    const result = await response.json().catch(() => null) as {
      stage?: string;
      code?: string;
      sent?: number;
      failed?: number;
      failureCodes?: Record<string, number>;
    } | null;
    if (!response.ok) {
      console.error("[MITSU] Push notification was not delivered", {
        status: response.status,
        stage: result?.stage || "unknown",
        code: result?.code || "UNKNOWN",
      });
    } else if ((result?.failed || 0) > 0) {
      console.error("[MITSU] Some device push deliveries failed", {
        sent: result?.sent || 0,
        failed: result?.failed || 0,
        failureCodes: result?.failureCodes || {},
      });
    }
  } catch (error) {
    console.error("[MITSU] Push notification request failed:", error);
  }
}
