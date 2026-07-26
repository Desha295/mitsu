"use client";

import { isFirebaseConfigured } from "@/lib/firebase/config";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { EmptyState } from "@/components/admin/EmptyState";
import { dashboardStats, quickActions } from "@/data/adminDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { cx } from "@/lib/utils";

/**
 * Dashboard home (Sprint 3.1). Everything here is a static placeholder —
 * no Firestore reads. Stats show a translated "Coming soon" value
 * rather than a fabricated number; Quick Actions are disabled (their
 * target pages don't exist yet); Recent Activity is a genuine empty
 * state; System Status is the one section showing real information —
 * whether Firebase is configured — since that's a synchronous SDK
 * config check, not a Firestore read.
 */
export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { translate } = useLanguage();

  const displayName = user?.displayName || user?.email || "";

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={translate("admin.dashboard.heading")}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root") },
          { label: translate("admin.dashboard.heading") },
        ]}
      />

      {/* Welcome section with logged-in user information */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {translate("admin.dashboard.welcomeHeading")}
          {displayName ? `, ${displayName}` : ""}
        </h2>
        <p className="mt-1 text-sm text-foreground/70">
          {translate("admin.dashboard.welcomeSubheading")}
        </p>
      </div>

      {/* Placeholder statistics */}
      <div>
        <SectionHeader title={translate("admin.dashboard.statsHeading")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              label={translate(stat.labelKey)}
              value={translate("admin.stats.placeholderValue")}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions (disabled — target pages not built yet) */}
      <div>
        <SectionHeader title={translate("admin.dashboard.quickActionsHeading")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              icon={action.icon}
              label={translate(action.labelKey)}
              comingSoonLabel={translate("admin.sidebar.comingSoon")}
              href={action.id === "hero" ? action.href : undefined}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity placeholder */}
        <div>
          <SectionHeader title={translate("admin.dashboard.recentActivityHeading")} />
          <EmptyState title={translate("admin.dashboard.recentActivityEmpty")} />
        </div>

        {/* System Status — genuinely accurate, not fabricated */}
        <div>
          <SectionHeader title={translate("admin.dashboard.systemStatusHeading")} />
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground/70">
                {translate("admin.dashboard.systemStatus.firebase")}
              </span>
              <span
                className={cx(
                  "font-medium",
                  isFirebaseConfigured ? "text-secondary-dark" : "text-foreground/50"
                )}
              >
                {isFirebaseConfigured
                  ? translate("admin.dashboard.systemStatus.connected")
                  : translate("admin.dashboard.systemStatus.notConnected")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
