"use client";

import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { HeroForm } from "@/components/admin/HeroForm";
import { heroService } from "@/lib/firebase/services";
import type { HeroDoc } from "@/lib/firebase/collections";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";

const EMPTY_HERO: HeroDoc = {
  heading: "",
  description: "",
  primaryCtaLabel: "",
  primaryCtaHref: "",
  secondaryCtaLabel: "",
  secondaryCtaHref: "",
  imageUrl: "",
  isActive: true,
  updatedAt: undefined as unknown as HeroDoc["updatedAt"],
};

/**
 * Hero management page (Sprint 3.2). First real CRUD admin page — reads
 * and writes through Sprint 2.2's heroService, gated by the
 * manageHero permission (Sprint 3.2 addition to Sprint 2.3's constants).
 */
export default function AdminHeroPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [existingId, setExistingId] = useState<string | null>(null);
  const [existingDoc, setExistingDoc] = useState<HeroDoc | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [saved, setSaved] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageHero) : false;
  const loadingHero = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    heroService.getAll().then((docs) => {
      if (cancelled) return;
      if (docs.length > 0) {
        const preferred = docs.find((doc) => doc.isActive) ?? docs[0];
        const { id, ...rest } = preferred;
        setExistingId(id);
        setExistingDoc(rest);
      }
      setHasFetched(true);
    });
    return () => {
      cancelled = true;
    };
  }, [allowed]);

  if (authLoading || loadingHero) {
    return <LoadingDashboard />;
  }

  if (!admin || !allowed) {
    return <Unauthorized />;
  }

  async function handleCreate(values: HeroDoc) {
    const payload: HeroDoc = { ...values, updatedAt: Timestamp.now() };
    const id = await heroService.create(payload);
    setExistingId(id);
    setExistingDoc(payload);
    setSaved(true);
  }

  async function handleUpdate(values: HeroDoc) {
    if (!existingId) return;
    const payload: HeroDoc = { ...values, updatedAt: Timestamp.now() };
    await heroService.update(existingId, payload);
    setExistingDoc(payload);
    setSaved(true);
  }

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={translate("admin.hero.heading")}
        description={translate("admin.hero.subheading")}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          { label: translate("admin.hero.heading") },
        ]}
      />

      {saved && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate("admin.hero.form.saved")}
        </p>
      )}

      {existingDoc ? (
        <HeroForm
          key={existingId}
          initialValues={existingDoc}
          onSubmit={handleUpdate}
          submitLabel={translate("admin.hero.form.saveChanges")}
          submittingLabel={translate("admin.hero.form.saving")}
        />
      ) : (
        <>
          <EmptyState
            icon="ImageOff"
            title={translate("admin.hero.empty.title")}
            description={translate("admin.hero.empty.description")}
          />
          <HeroForm
            initialValues={EMPTY_HERO}
            onSubmit={handleCreate}
            submitLabel={translate("admin.hero.form.create")}
            submittingLabel={translate("admin.hero.form.saving")}
          />
        </>
      )}
    </PageContainer>
  );
}
