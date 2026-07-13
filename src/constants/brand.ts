/**
 * Brand constants for MITSU.
 * Source of truth: 04_DESIGN_SYSTEM.md and 08_BRAND_GUIDELINES.md
 *
 * These values mirror the CSS custom properties defined in
 * `src/app/globals.css`. Prefer Tailwind utility classes (e.g. `bg-primary`)
 * in components; use these constants only when a raw value is required
 * outside of CSS (e.g. chart libraries, canvas, inline SVG generated at runtime).
 *
 * NOTE: Exact official hex codes have not been provided yet. Placeholder
 * values below will be replaced once official brand assets are supplied.
 */

export const BRAND_NAME = "MITSU";
export const BRAND_FULL_NAME = "MUST Information Technology Student Union";

export const BRAND_COLORS = {
  primary: "#1D5FB8",
  primaryDark: "#164A8F",
  secondary: "#2E9E5B",
  secondaryDark: "#227A45",
  white: "#FFFFFF",
  darkGray: "#1A1D23",
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const SPACING_BASE_UNIT = 8;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
} as const;

export const FONTS = {
  latin: "Inter",
  arabic: "Cairo",
} as const;
