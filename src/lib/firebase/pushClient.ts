"use client";

import { signInAnonymously, type User } from "firebase/auth";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  deleteToken,
  type Messaging,
} from "firebase/messaging";
import { auth } from "@/lib/firebase/auth";
import { app } from "@/lib/firebase/config";

let messagingPromise: Promise<Messaging | null> | null = null;
let foregroundMessaging: Messaging | null = null;

function listenForForegroundPush(messaging: Messaging) {
  if (foregroundMessaging === messaging) return;
  foregroundMessaging = messaging;

  onMessage(messaging, (payload) => {
    if (Notification.permission !== "granted") return;
    const data = payload.data || {};
    const isArabic = (document.documentElement.lang || navigator.language)
      .toLowerCase()
      .startsWith("ar");
    const registration = navigator.serviceWorker.getRegistration("/");
    void registration.then((serviceWorker) => serviceWorker?.showNotification(
      (isArabic ? data.titleAr : data.titleEn) || (isArabic ? "إشعار جديد" : "New notification"),
      {
        body: (isArabic ? data.bodyAr : data.bodyEn) || "",
        icon: "/images/branding/mitsu-logo.png",
        badge: "/images/branding/mitsu-logo.png",
        tag: data.notificationId || "mitsu-notification",
        data: { href: data.href || "/" },
      }
    )).catch((error: unknown) => {
      const code = typeof error === "object" && error !== null && "name" in error
        ? String((error as { name?: unknown }).name || "UNKNOWN")
        : "UNKNOWN";
      console.error("[MITSU] Foreground push display failed", { code });
    });
  });
}

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

async function getAuthenticatedUser() {
  if (!auth) throw new Error("PUSH_NOT_CONFIGURED");
  return auth.currentUser || (await signInAnonymously(auth)).user;
}

async function updateServerSubscription(
  action: "subscribe" | "unsubscribe" | "status",
  token: string,
  user: User
) {
  const response = await fetch("/api/push/subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, token }),
  });
  const result = await response.json().catch(() => null) as {
    code?: string;
    stage?: string;
    subscribed?: boolean;
  } | null;
  if (!response.ok) {
    throw new Error(`PUSH_${action.toUpperCase()}_API:${result?.stage || "api"}:${result?.code || `HTTP_${response.status}`}`);
  }
  return result;
}

/** Permission can remain granted after the server-side device subscription is removed. */
export async function getPushSubscriptionState() {
  if (typeof window === "undefined" || !auth || Notification.permission !== "granted") return false;
  const messaging = await getBrowserMessaging();
  if (!messaging) return false;
  try {
    const user = await getAuthenticatedUser();
    const registration = await navigator.serviceWorker.getRegistration("/");
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      ...(registration ? { serviceWorkerRegistration: registration } : {}),
    });
    if (!token) return false;
    const result = await updateServerSubscription("status", token, user);
    const subscribed = result?.subscribed === true;
    if (subscribed) listenForForegroundPush(messaging);
    return subscribed;
  } catch (error) {
    console.error("[MITSU] Push subscription status check failed", {
      code: error instanceof Error ? error.message : "UNKNOWN",
    });
    return false;
  }
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

  let user;
  try {
    user = await getAuthenticatedUser();
  } catch (error) {
    throw pushError("anonymous-auth", error);
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
    await updateServerSubscription("subscribe", token, user);
    listenForForegroundPush(messaging);
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
  let token: string;
  try {
    const registration = await navigator.serviceWorker.getRegistration("/");
    token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      ...(registration ? { serviceWorkerRegistration: registration } : {}),
    });
  } catch (error) {
    throw pushError("unsubscribe-token", error);
  }
  if (token) {
    try {
      await updateServerSubscription("unsubscribe", token, auth.currentUser);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("PUSH_")) throw error;
      throw pushError("unsubscribe-api", error);
    }
  }
  try {
    await deleteToken(messaging);
  } catch (error) {
    throw pushError("unsubscribe-local-token", error);
  }
}
