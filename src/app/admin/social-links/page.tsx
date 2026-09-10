"use client";

import { useState } from "react";
import { GripVertical, Pencil, Plus, Share2, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useLanguage } from "@/hooks/useLanguage";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { socialLinksService } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/auth/constants";
import type { SocialLinkDoc } from "@/lib/firebase/collections";

type SocialLinkWithId = SocialLinkDoc & { id: string };

const EMPTY_LINK: SocialLinkDoc = {
  nameAr: "",
  nameEn: "",
  url: "",
  icon: "Share2",
  order: 0,
  isActive: true,
};

export default function SocialLinksAdminPage() {
  const { language, translate } = useLanguage();
  const isArabic = language === "ar";

  const { admin, loading: authLoading } = useAuthGuard();

  const {
    data: socialLinks,
    loading,
    error,
  } = useFirestoreList<SocialLinkDoc>(socialLinksService, {
    orderByField: {
      field: "order",
      direction: "asc",
    },
  });

  const [editing, setEditing] = useState<SocialLinkWithId | null>(null);
  const [form, setForm] = useState<SocialLinkDoc>(EMPTY_LINK);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<SocialLinkWithId | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasAccess = canAccess(admin, PERMISSIONS.manageSocialLinks);

  function openCreate() {
    setEditing(null);
    setForm({
      ...EMPTY_LINK,
      order: socialLinks.length,
    });
    setShowForm(true);
  }

  function openEdit(link: SocialLinkWithId) {
    setEditing(link);
    setForm({
      nameAr: link.nameAr,
      nameEn: link.nameEn,
      url: link.url,
      icon: link.icon,
      order: link.order,
      isActive: link.isActive,
    });
    setShowForm(true);
  }

  function closeForm() {
    setEditing(null);
    setForm({ ...EMPTY_LINK });
    setShowForm(false);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasAccess) return;

    if (!form.nameAr.trim() || !form.nameEn.trim() || !form.url.trim()) {
      return;
    }

    setSaving(true);

    try {
      const data: SocialLinkDoc = {
        nameAr: form.nameAr.trim(),
        nameEn: form.nameEn.trim(),
        url: form.url.trim(),
        icon: form.icon.trim() || "Share2",
        order: form.order,
        isActive: form.isActive,
      };

      if (editing) {
        await socialLinksService.update(editing.id, data);
      } else {
        await socialLinksService.create(data);
      }

      closeForm();

      // useFirestoreList has no refresh() API.
      // The page will reflect the change on the next mount.
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || !hasAccess) return;

    setDeleting(true);

    try {
      await socialLinksService.remove(deleteTarget.id);
      setDeleteTarget(null);

      // useFirestoreList has no refresh() API.
      // The deleted item will disappear after the page is remounted.
    } finally {
      setDeleting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <EmptyState
        icon="ShieldAlert"
        title={translate("common.accessDenied")}
        description={translate("common.noPermission")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Share2 className="h-5 w-5" aria-hidden="true" />
            </span>

            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {isArabic ? "روابط التواصل" : "Social Links"}
              </h1>

              <p className="mt-1 text-sm text-foreground/60">
                {isArabic
                  ? "إدارة روابط التواصل الاجتماعي الظاهرة في الموقع."
                  : "Manage the social media links displayed across the website."}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {isArabic ? "إضافة رابط" : "Add Link"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-foreground">
          {isArabic
            ? "حدث خطأ أثناء تحميل روابط التواصل."
            : "Something went wrong while loading social links."}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-lg border border-border bg-surface p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {editing
                  ? isArabic
                    ? "تعديل الرابط"
                    : "Edit Link"
                  : isArabic
                    ? "إضافة رابط جديد"
                    : "Add New Link"}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">
                الاسم بالعربي
              </span>
              <input
                type="text"
                value={form.nameAr}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nameAr: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">
                English Name
              </span>
              <input
                type="text"
                value={form.nameEn}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nameEn: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                required
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-foreground">
                URL
              </span>
              <input
                type="url"
                value={form.url}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    url: event.target.value,
                  }))
                }
                placeholder="https://..."
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">
                Icon
              </span>
              <input
                type="text"
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    icon: event.target.value,
                  }))
                }
                placeholder="Instagram"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <span className="text-xs text-foreground/50">
                {isArabic
                  ? "اكتب اسم أي Lucide icon."
                  : "Enter a Lucide icon name."}
              </span>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">
                {isArabic ? "الترتيب" : "Order"}
              </span>
              <input
                type="number"
                value={form.order}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    order: Number(event.target.value),
                  }))
                }
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-border"
              />

              <span className="text-sm font-medium text-foreground">
                {isArabic ? "الرابط نشط" : "Active"}
              </span>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {saving
                ? isArabic
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isArabic
                  ? "حفظ"
                  : "Save"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-border bg-surface">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : socialLinks.length === 0 ? (
        <EmptyState
          icon="Share2"
          title={isArabic ? "لا توجد روابط بعد" : "No social links yet"}
          description={
            isArabic
              ? "أضف أول رابط تواصل ليظهر في الموقع."
              : "Add your first social link to display it on the website."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="divide-y divide-border">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-4 px-4 py-4 sm:px-6"
              >
                <GripVertical
                  className="h-5 w-5 shrink-0 text-foreground/30"
                  aria-hidden="true"
                />

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">
                      {isArabic ? link.nameAr : link.nameEn}
                    </p>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        link.isActive
                          ? "bg-primary-light text-primary"
                          : "bg-surface-muted text-foreground/50"
                      }`}
                    >
                      {link.isActive
                        ? isArabic
                          ? "نشط"
                          : "Active"
                        : isArabic
                          ? "غير نشط"
                          : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-foreground/50">
                    {link.url}
                  </p>

                  <p className="mt-1 text-xs text-foreground/40">
                    {isArabic ? "الترتيب" : "Order"}: {link.order} ·{" "}
                    {link.icon}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(link)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors hover:bg-surface-muted hover:text-foreground"
                    aria-label={isArabic ? "تعديل" : "Edit"}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(link)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors hover:bg-surface-muted hover:text-foreground"
                    aria-label={isArabic ? "حذف" : "Delete"}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={isArabic ? "حذف رابط التواصل؟" : "Delete this social link?"}
        description={
          deleteTarget
            ? isArabic
              ? `سيتم حذف "${deleteTarget.nameAr}" نهائيًا.`
              : `"${deleteTarget.nameEn}" will be permanently deleted.`
            : undefined
        }
        confirmLabel={isArabic ? "حذف" : "Delete"}
        confirmingLabel={isArabic ? "جاري الحذف..." : "Deleting..."}
        cancelLabel={isArabic ? "إلغاء" : "Cancel"}
        destructive
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}