"use client";

import { useEffect, useState } from "react";
import { BellRing, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import {
  disablePushNotifications,
  enablePushNotifications,
  getPushAvailability,
  isPushConfigured,
  requiresIosHomeScreenInstall,
} from "@/lib/firebase/pushClient";
import { cx, focusRing } from "@/lib/utils";

export function PushNotificationControl() {
  const { translate } = useLanguage();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [iosInstallRequired, setIosInstallRequired] = useState(false);

  useEffect(() => {
    let active = true;
    void getPushAvailability().then((available) => {
      if (!active) return;
      setSupported(available && isPushConfigured());
      setEnabled(available && Notification.permission === "granted");
      setIosInstallRequired(requiresIosHomeScreenInstall());
    });
    return () => { active = false; };
  }, []);

  async function toggle() {
    setBusy(true);
    setMessage("");
    try {
      if (enabled) {
        await disablePushNotifications();
        setEnabled(false);
      } else {
        await enablePushNotifications();
        setEnabled(true);
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      if (code === "PUSH_PERMISSION_DENIED") setMessage(translate("push.denied"));
      else if (code === "PUSH_NOT_CONFIGURED") setMessage(translate("push.setupMissing"));
      else if (code === "PUSH_ANONYMOUS_AUTH:auth/operation-not-allowed") {
        setMessage(`${translate("push.anonymousAuthDisabled")} (${code})`);
      } else {
        setMessage(`${translate("push.error")} [${code || "UNKNOWN"}]`);
      }
    } finally {
      setBusy(false);
    }
  }

  const unsupportedText = supported === false
    ? (iosInstallRequired ? "push.iosInstall" : isPushConfigured() ? "push.unsupported" : "push.setupMissing")
    : "";

  return (
    <div className="border-b border-border bg-surface-muted/60 px-4 py-3">
      <div className="flex items-start gap-3">
        <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground">{translate("push.title")}</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            {supported === false ? translate(unsupportedText) : translate(enabled ? "push.enabled" : "push.description")}
          </p>
          {message && <p role="alert" className="mt-1 text-xs text-primary">{message}</p>}
        </div>
        {supported && !iosInstallRequired && (
          <button
            type="button"
            onClick={() => void toggle()}
            disabled={busy}
            className={cx("shrink-0 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted disabled:opacity-60", focusRing)}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-label={translate("common.loading")} /> : translate(enabled ? "push.disable" : "push.enable")}
          </button>
        )}
      </div>
    </div>
  );
}
