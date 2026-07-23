import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Base card primitive (components/admin). Provides the shared border/
 * padding/shadow/background so StatCard and QuickActionCard don't
 * duplicate that styling — the same "small building block, composed by
 * specific cards" pattern used throughout the public site (e.g.
 * SystemCard/CommitteeCard build on their own shared visual language).
 */
export function AdminCard({ children, className }: AdminCardProps) {
  return (
    <div
      className={cx(
        "rounded-lg border border-border bg-surface p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
