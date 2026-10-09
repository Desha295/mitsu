"use client";

import { signInAnonymously } from "firebase/auth";
import {
  getMessaging,
  getToken,
  isSupported,
  deleteToken,
  type Messaging,
} from "firebase/messaging";
import { auth } from "@/lib/firebase/auth";
import { app } from "@/lib/firebase/config";

let messagingPromise: Promise<Messaging | null> | null = null;

async function getBrowserMessaging() {
  if (!app || !auth || typeof window === "undefined") return null;
  const firebaseApp = app;
  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => supported ? getMessaging(firebaseApp) : null)
      .catch(() => null);
  }
  return messagingPromise;
}

export async function getPushAvailability() {
  const messaging = await getBrowserMessaging();
  return Boolean(
    messaging &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

export function isPushConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);
}

export function requiresIosHomeScreenInstall() {
  if (typeof window === "undefined") return false;
  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isInstalled = window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
  return isIos && !isInstalled;
}

export async function enablePushNotifications() {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!auth || !vapidKey) {
    throw new Error("PUSH_NOT_CONFIGURED");
  }

  const permission = await Notification.requestPermission().catch((error: unknown) => {
    throw pushError("permission", error);
  });
  if (permission !== "granted") throw new Error("PUSH_PERMISSION_DENIED");

  const messaging = await getBrowserMessaging();
  if (!messaging) throw new Error("PUSH_NOT_AVAILABLE");

  let user = auth.currentUser;
  if (!user) {
    try {
      user = (await signInAnonymously(auth)).user;
    } catch (error) {
      throw pushError("anonymous-auth", error);
    }
  }

  let registration: ServiceWorkerRegistration;
  try {
    registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" }
    );
  } catch (error) {
    throw pushError("service-worker", error);
  }

  let token: string;
  try {
    token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    throw pushError("fcm-token", error);
  }
  if (!token) throw new Error("PUSH_TOKEN_UNAVAILABLE");

  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/push/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "subscribe", token }),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null) as { code?: string; stage?: string } | null;
      throw new Error(
        `PUSH_SUBSCRIPTION_API:${result?.stage || "api"}:${result?.code || `HTTP_${response.status}`}`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("PUSH_")) throw error;
    throw pushError("subscription-api", error);
  }
}

function pushError(stage: string, error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code || "UNKNOWN")
    : "UNKNOWN";
  const diagnostic = `PUSH_${stage.toUpperCase().replaceAll("-", "_")}:${code}`;
  console.error("[MITSU] Push activation failed", { stage, code });
  return new Error(diagnostic);
}

export async function disablePushNotifications() {
  const messaging = await getBrowserMessaging();
  if (!messaging || !auth || !auth.currentUser) throw new Error("PUSH_NOT_AVAILABLE");
  const registration = await navigator.serviceWorker.getRegistration("/");
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    ...(registration ? { serviceWorkerRegistration: registration } : {}),
  });
  if (token) {
    const response = await fetch("/api/push/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "unsubscribe", token }),
    });
    if (!response.ok) throw new Error("PUSH_UNSUBSCRIBE_FAILED");
  }
  await deleteToken(messaging);
}
