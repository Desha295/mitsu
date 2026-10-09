// Register click handling before Firebase Messaging; its worker SDK may
// install its own handler during importScripts.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const href = event.notification.data?.href || "/";
  const target = new URL(href, self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if ("focus" in client) {
        await client.navigate(target);
        return client.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});

importScripts("/api/push/firebase-config");
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js");

if (self.MITSU_FIREBASE_CONFIG && !firebase.apps.length) {
  firebase.initializeApp(self.MITSU_FIREBASE_CONFIG);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const data = payload.data || {};
    const isArabic = self.navigator.language.toLowerCase().startsWith("ar");
    const title = isArabic ? data.titleAr : data.titleEn;
    const body = isArabic ? data.bodyAr : data.bodyEn;
    return self.registration.showNotification(title || (isArabic ? "إشعار جديد" : "New notification"), {
      body: body || "",
      icon: "/images/branding/mitsu-logo.png",
      badge: "/images/branding/mitsu-logo.png",
      tag: data.notificationId || "mitsu-notification",
      renotify: false,
      data: { href: data.href || "/" },
    });
  });
}
