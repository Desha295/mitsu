"use client";

import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { settingsService } from "@/lib/firebase/services";
import type { SettingsDoc } from "@/lib/firebase/collections";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";

const EMPTY_SETTINGS: SettingsDoc = {
  projectName: "",
  universityName: "",
  logoUrl: "",
  universityLogoUrl: "",
  campusImageUrl: "",
  whatsappCommunityUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  contactEmail: "",
  contactPhone: "",
  officeLocation: "",
  unionLogoUrl: "",
  updatedAt: undefined as unknown as SettingsDoc["updatedAt"],
};

/**
 * Site Settings management page (Sprint 5.0 — Site Settings Foundation).
 * Reads and writes through the new settingsService, gated by the
 * manageSettings permission (already defined since Sprint 2.3, unused
 * until this sprint).
 *
 * Simpler than every other admin page: /settings/general is a single
 * always-present document, not a collection, so there's no list, no
 * create-vs-edit distinction, no EmptyState, and no ConfirmDialog
 * (nothing to ever delete). The form is always shown, pre-filled with
 * whatever currently exists (or EMPTY_SETTINGS defaults if the document
 * doesn't exist in Firestore yet), and every save goes through the same
 * single handleSave — settingsService.update() merge-sets, so it
 * transparently creates the document on the very first save without
 * needing a separate create path.
 */
export default function AdminSettingsPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [currentSettings, setCurrentSettings] = useState<SettingsDoc>(EMPTY_SETTINGS);
  const [hasFetched, setHasFetched] = useState(false);
  const [saved, setSaved] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageSettings) : false;
  const loadingSettings = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    settingsService.get().then((doc) => {
      if (cancelled) return;
      if (doc) {
        const rest: SettingsDoc = doc;
        setCurrentSettings(rest);
      }
      setHasFetched(true);
    });
    return () => {
      cancelled = true;
    };
  }, [allowed]);

  if (authLoading || loadingSettings) {
    return <LoadingDashboard />;
  }

  if (!admin || !allowed) {
    return <Unauthorized />;
  }

  async function handleSave(values: SettingsDoc) {
    const payload: SettingsDoc = { ...values, updatedAt: Timestamp.now() };
    await settingsService.update(payload);
    setCurrentSettings(payload);
    setSaved(true);
  }

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={translate("admin.settings.heading")}
        description={translate("admin.settings.subheading")}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          { label: translate("admin.settings.heading") },
        ]}
      />

      {saved && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate("admin.settings.form.saved")}
        </p>
      )}

      <SettingsForm
        initialValues={currentSettings}
        onSubmit={handleSave}
        submitLabel={translate("admin.settings.form.save")}
        submittingLabel={translate("admin.settings.form.saving")}
      />
    </PageContainer>
  );
}
