"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mainNavigation } from "@/data/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface NavLinksProps {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
}

export function NavLinks({
  orientation = "horizontal",
  onNavigate,
  className,
}: NavLinksProps) {
  const pathname = usePathname();
  const { translate } = useLanguage();

  return (
    <ul
      className={cx(
        "flex",
        orientation === "horizontal"
          ? "items-center justify-center gap-0.5"
          : "flex-col gap-1.5",
        className
      )}
    >
      {mainNavigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" &&
            pathname.startsWith(`${item.href}/`));

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cx(
                "group relative block rounded-xl px-3.5 py-2.5",
                "text-sm font-medium",
                "transition-all duration-200 ease-out",
                "outline-none",
                focusRing,
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
                  : "text-foreground/70 hover:bg-background/80 hover:text-foreground hover:shadow-sm",
                orientation === "vertical" && "w-full"
              )}
            >
              <span className="relative z-10">
                {translate(item.labelKey)}
              </span>

              {/* Active indicator */}
              {isActive ? (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute bottom-1.5 start-1/2",
                    "h-0.5 w-4 -translate-x-1/2",
                    "rounded-full",
                    "bg-primary-foreground/70",
                    "transition-all duration-200",
                  ].join(" ")}
                />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
