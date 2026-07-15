"use client";

import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Theme toggle (components/shared — project-specific reusable component
 * per 07_COMPONENT_RULES.md §3.4). Icon-only, so the accessible label
 * always names the action that will happen next.
 */
export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { translate } = useLanguage();

  const label =
    theme === "light"
      ? translate("navbar.toggleThemeToDark")
      : translate("navbar.toggleThemeToLight");

  return (
    <IconButton label={label} onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Sun className="h-5 w-5" aria-hidden="true" />
      )}
    </IconButton>
  );
}
