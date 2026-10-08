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
    if (!response.ok) {
      console.error("[MITSU] Push notification was not delivered.");
    }
  } catch (error) {
    console.error("[MITSU] Push notification request failed:", error);
  }
}
