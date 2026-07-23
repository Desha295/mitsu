"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { adminNavigation } from "@/data/adminNavigation";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";

interface AdminSidebarProps {
  /** Desktop collapse state — icon-only width when true. */
  collapsed: boolean;
  /** Mobile only: whether the off-canvas sidebar is open. */
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

/**
 * Admin sidebar (components/admin). Desktop: persistent, collapsible to
 * icon-only width. Mobile: off-canvas overlay, mirroring the accessible
 * pattern already established by MobileMenu (Sprint 1.1) — Escape to
 * close, scroll lock while open, backdrop click to close.
 *
 * Only "Dashboard" is a real route this sprint (data/adminNavigation.ts);
 * every other item renders as non-interactive with a "Coming soon" badge.
 */
export function AdminSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { translate } = useLanguage();

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseMobile();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, onCloseMobile]);

  const navList = (
    <ul className="flex-1 space-y-1 overflow-y-auto p-3">
      {adminNavigation.map((item) => {
        const IconComponent = (
          Icons as unknown as Record<
            string,
            React.ComponentType<{ className?: string }>
          >
        )[item.icon];
        const isActive = pathname === item.href;
        const label = translate(item.labelKey);

        if (!item.isImplemented) {
          return (
            <li key={item.id}>
              <div
                aria-disabled="true"
                title={collapsed ? label : undefined}
                className={cx(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/40",
                  collapsed && "justify-center px-0"
                )}
              >
                {IconComponent && (
                  <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                {!collapsed && (
                  <span className="flex flex-1 items-center justify-between gap-2">
                    {label}
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium">
                      {translate("admin.sidebar.comingSoon")}
                    </span>
                  </span>
                )}
              </div>
            </li>
          );
        }

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onCloseMobile}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? label : undefined}
              className={cx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-foreground/80 hover:bg-surface-muted hover:text-foreground",
                collapsed && "justify-center px-0",
                focusRing
              )}
            >
              {IconComponent && (
                <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              {!collapsed && <span>{label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const brandRow = (
    <div
      className={cx(
        "flex h-16 shrink-0 items-center border-b border-border px-4",
        collapsed && "justify-center px-0"
      )}
    >
      {collapsed ? (
        <span className="text-lg font-bold text-primary">M</span>
      ) : (
        <Logo showIdentity={false} />
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cx(
          "hidden shrink-0 flex-col border-e border-border bg-surface transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {brandRow}
        {navList}
      </aside>

      {/* Mobile off-canvas sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={onCloseMobile}
            className="fixed inset-0 animate-fade-in bg-overlay"
          />
          <aside className="fixed inset-y-0 start-0 z-50 flex w-64 animate-fade-slide-down flex-col bg-surface shadow-lg">
            {brandRow}
            {navList}
          </aside>
        </div>
      )}
    </>
  );
}
