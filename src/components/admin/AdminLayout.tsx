"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

interface AdminLayoutProps {
  children: ReactNode;
  user: User;
}

/**
 * Admin dashboard shell (components/admin): Sidebar + Topbar + content,
 * owning the collapsed/mobile-open UI state both child components need.
 *
 * Note: this renders nested within the public root layout's Navbar/
 * Footer rather than replacing them outright — giving /admin fully
 * separate page chrome would require restructuring the root layout into
 * route groups, which touches every existing route's file location and
 * is explicitly out of bounds for this sprint's "do not modify Sprint
 * 1.x/2.x" constraint. Flagged as a follow-up candidate in
 * PROJECT_STATE.md.
 */
export function AdminLayout({ children, user }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[70vh] bg-background">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((prev) => !prev)}
          onOpenMobileMenu={() => setMobileOpen(true)}
          user={user}
        />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
