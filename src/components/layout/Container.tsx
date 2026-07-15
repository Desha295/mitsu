import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Render as a different element when needed (e.g. "section"). Defaults to "div". */
  as?: ElementType;
  className?: string;
}

/**
 * Global responsive container (components/layout).
 * Max width 1200px, centered, full width with safe padding on mobile —
 * per 04_DESIGN_SYSTEM.md #8. Used by Navbar and Footer, and available
 * to any future section that needs the same content width.
 */
export function Container({
  children,
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cx("mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
