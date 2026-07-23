"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { IconButton } from "@/components/ui/IconButton";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface AdminTopbarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMobileMenu: () => void;
  user: User;
}

/**
 * Admin topbar (components/admin). Persistent across every admin page:
 * mobile sidebar toggle, desktop collapse toggle, theme/language
 * switchers (reused as-is from the public site), a User Profile Area,
 * and Logout — which calls useAuth().logout() directly (Sprint 2.4),
 * not a reimplementation.
 */
export function AdminTopbar({
  collapsed,
  onToggleCollapsed,
  onOpenMobileMenu,
  user,
}: AdminTopbarProps) {
  const { translate } = useLanguage();
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  const displayName = user.displayName || user.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-2">
        <IconButton
          label={translate("admin.topbar.openMenu")}
          onClick={onOpenMobileMenu}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </IconButton>

        <IconButton
          label={translate(
            collapsed ? "admin.sidebar.expand" : "admin.sidebar.collapse"
          )}
          onClick={onToggleCollapsed}
          className="hidden md:inline-flex"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
          )}
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />

        {/* User Profile Area */}
        <div className="ms-2 hidden items-center gap-2 border-s border-border ps-3 sm:flex">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
            {initial}
          </span>
          <div className="hidden lg:block">
            <p className="text-xs text-foreground/50">
              {translate("admin.topbar.signedInAs")}
            </p>
            <p className="max-w-[160px] truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors duration-150 hover:bg-surface-muted hover:text-foreground",
            focusRing
          )}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{translate("admin.logout")}</span>
        </button>
      </div>
    </header>
  );
}
