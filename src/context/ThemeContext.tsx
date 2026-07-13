"use client";

import { createContext, useCallback, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { Theme, ThemeContextValue } from "@/types/theme.types";

const STORAGE_KEY = "mitsu-theme";
const listeners = new Set<() => void>();

/**
 * Theme lives in localStorage (the "external store"). useSyncExternalStore
 * reads it directly during render — no setState-in-effect, no cascading
 * render, and getServerSnapshot keeps SSR/first-paint markup consistent
 * ("light") until the client re-renders with the real stored preference.
 */
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function persistTheme(theme: Theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  listeners.forEach((listener) => listener());
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync the resolved theme to the DOM (an external system) — this is a
  // legitimate effect use, distinct from calling a React state setter.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((next: Theme) => persistTheme(next), []);

  const toggleTheme = useCallback(() => {
    persistTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
