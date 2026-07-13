export type Language = "en" | "ar";

export type Direction = "ltr" | "rtl";

/** Nested JSON structure allowed for translation files (locales/en.json, ar.json) */
export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface LanguageContextValue {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /** Look up a translation by dot-notation key, e.g. translate("nav.home") */
  translate: (key: string, fallback?: string) => string;
}
