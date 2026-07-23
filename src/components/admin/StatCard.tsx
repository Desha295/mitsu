"use client";

import * as Icons from "lucide-react";
import { AdminCard } from "./AdminCard";

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

/**
 * Statistic display card (components/admin), built on AdminCard.
 * `value` is a plain string so the dashboard page can pass a genuine
 * placeholder (e.g. translated "Coming soon") rather than this
 * component inventing or formatting a number itself — no Firestore
 * reads happen here or anywhere this sprint.
 */
export function StatCard({ icon, label, value }: StatCardProps) {
  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>
  )[icon];

  return (
    <AdminCard className="flex items-center gap-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
        {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
      </span>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-foreground/60">{label}</p>
      </div>
    </AdminCard>
  );
}
