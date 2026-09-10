"use client";

import Link from "next/link";
import * as Icons from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  iconName: string;
}

export function QuickAccessCard({
  title,
  description,
  href,
  iconName,
}: QuickAccessCardProps) {
  const { translate, language } = useLanguage();

  // Dynamically resolve icon from lucide-react
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[iconName];

  return (
    <Link
      href={href}
      className={cx(
        "group relative flex min-h-[250px] h-full flex-col overflow-hidden rounded-3xl",
        "border border-border/80 bg-surface/80",
        "p-6 sm:p-7",
        "shadow-sm backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/30",
        "hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]",
        "dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]",
        focusRing
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div
          className={cx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            "bg-primary/10 text-primary",
            "transition-all duration-300",
            "group-hover:bg-primary group-hover:text-primary-foreground"
          )}
        >
          {IconComponent ? (
            <IconComponent
              className="h-6 w-6"
              aria-hidden="true"
            />
          ) : null}
        </div>

        <span
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center",
            "rounded-full border border-border bg-background/70",
            "text-muted-foreground",
            "transition-all duration-300",
            "group-hover:border-primary/30",
            "group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <Icons.ArrowUpRight
            className={cx(
              "h-4 w-4 transition-transform duration-300",
              language === "ar"
                ? "rotate-[-90deg] group-hover:-translate-x-0.5"
                : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            )}
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="relative z-10 mt-auto pt-8">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>

        <div
          className={cx(
            "mt-5 text-xs font-semibold text-primary",
            "transition-transform duration-300",
            language === "ar"
              ? "group-hover:-translate-x-1"
              : "group-hover:translate-x-1"
          )}
        >
          {translate("home.quickAccess.explore")}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 start-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full"
      />
    </Link>
  );
}