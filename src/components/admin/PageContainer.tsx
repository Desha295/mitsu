import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Consistent content wrapper for admin page bodies (components/admin).
 * Mirrors components/layout/Container.tsx's role for public pages, but
 * sized/spaced for a denser dashboard UI rather than marketing content.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cx("mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
