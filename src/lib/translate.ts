import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import type { Language, TranslationDictionary } from "@/types/language.types";

const DICTIONARIES: Record<Language, TranslationDictionary> = { en, ar };

/**
 * Resolves a dot-notation key (e.g. "nav.home") against a translation
 * dictionary. Returns the fallback (or the key itself) if not found, so
 * missing content shows up visibly in placeholder/dev states rather than
 * silently rendering blank text.
 */
export function translate(
  language: Language,
  key: string,
  fallback?: string
): string {
  const dictionary = DICTIONARIES[language];
  const value = key
    .split(".")
    .reduce<TranslationDictionary | string | undefined>((acc, segment) => {
      if (acc && typeof acc === "object") {
        return acc[segment];
      }
      return undefined;
    }, dictionary);

  if (typeof value === "string") {
    return value;
  }

  return fallback ?? key;
}
