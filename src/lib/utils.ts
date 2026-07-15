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
