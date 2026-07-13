"use client";

import { createContext, useCallback, useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type {
  Direction,
  Language,
  LanguageContextValue,
} from "@/types/language.types";
import { translate as translateKey } from "@/lib/translate";

const STORAGE_KEY = "mitsu-language";
const listeners = new Set<() => void>();

function directionFor(language: Language): Direction {
  return language === "ar" ? "rtl" : "ltr";
}

/**
 * Language lives in localStorage (the "external store"), read directly
 * during render via useSyncExternalStore. See ThemeContext.tsx for why
 * this replaces the earlier setState-in-effect pattern.
 */
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Language {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ar" || stored === "en" ? stored : "en";
}

function getServerSnapshot(): Language {
  return "en";
}

function persistLanguage(language: Language) {
  window.localStorage.setItem(STORAGE_KEY, language);
  listeners.forEach((listener) => listener());
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Sync resolved language to the DOM (an external system) — legitimate
  // effect use, distinct from calling a React state setter.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = directionFor(language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => persistLanguage(next), []);

  const toggleLanguage = useCallback(() => {
    persistLanguage(language === "en" ? "ar" : "en");
  }, [language]);

  const translate = useCallback(
    (key: string, fallback?: string) => translateKey(language, key, fallback),
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction: directionFor(language),
        setLanguage,
        toggleLanguage,
        translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
