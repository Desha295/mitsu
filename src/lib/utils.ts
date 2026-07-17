/**
 * Joins class names together, filtering out falsy values.
 * Kept dependency-free (no `clsx`/`cn` package) per 09_DEVELOPMENT_STANDARDS.md #12
 * ("Avoid unnecessary dependencies") until a real need justifies adding one.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shared keyboard-focus ring, applied to every interactive element.
 * Centralized here so focus styling stays consistent (07_COMPONENT_RULES.md
 * §14 Accessibility) without repeating the same utility string everywhere.
 */
export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * Formats an ISO date string as a localized, human-readable date (e.g.
 * "July 15, 2026" / "١٥ يوليو ٢٠٢٦" → forced to Western digits below for
 * consistency with the rest of the app's number display, e.g. Sprint 1.4's
 * credit-hour stats). Shared by AnnouncementCard and EventCard rather than
 * duplicating date-formatting logic in each.
 */
export function formatDate(dateString: string, language: "en" | "ar"): string {
  const date = new Date(dateString);
  const locale = language === "ar" ? "ar-EG-u-nu-latn" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
