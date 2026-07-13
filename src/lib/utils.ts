/**
 * Joins class names together, filtering out falsy values.
 * Kept dependency-free (no `clsx`/`cn` package) per 09_DEVELOPMENT_STANDARDS.md #12
 * ("Avoid unnecessary dependencies") until a real need justifies adding one.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
