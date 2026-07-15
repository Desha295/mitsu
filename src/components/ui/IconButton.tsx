import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx, focusRing } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons have no visible text, so this becomes the accessible name. */
  label: string;
  children: ReactNode;
}

/**
 * Icon-only button primitive (components/ui — no business logic, no
 * Firebase calls, highly reusable per 07_COMPONENT_RULES.md §3.1).
 * Used by ThemeSwitcher and the mobile hamburger toggle.
 */
export function IconButton({
  label,
  children,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-foreground transition-colors duration-150 hover:bg-surface-muted",
        focusRing,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
