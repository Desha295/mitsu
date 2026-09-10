"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2, X } from "lucide-react";

import type { StudyPlan } from "@/data/studyPlans";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface StudyPlanCardProps {
  plan: StudyPlan;
}

export function StudyPlanCard({
  plan,
}: StudyPlanCardProps) {
  const { translate } = useLanguage();

  const [isFullSize, setIsFullSize] =
    useState(false);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  const triggerRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isFullSize) {
      return;
    }

    const triggerElement = triggerRef.current;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullSize(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";

      triggerElement?.focus();
    };
  }, [isFullSize]);

  const majorName = translate(plan.majorNameKey);
  const altText = translate(plan.imageAltKey);

  return (
    <>
      <article
        className={[
          "group relative flex h-full flex-col overflow-hidden",
          "rounded-3xl border border-border/70",
          "bg-surface/80 backdrop-blur-xl",
          "shadow-sm",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1",
          "hover:border-primary/25",
          "hover:shadow-xl hover:shadow-primary/5",
        ].join(" ")}
      >
        {/* Top accent */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {translate("studyPlans.heading")}
            </p>

            <h3 className="text-base font-semibold leading-6 text-foreground">
              {majorName}
            </h3>
          </div>

          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-muted-foreground transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary"
          >
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Image */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsFullSize(true)}
          aria-label={`${translate(
            "studyPlans.viewFullSize"
          )} — ${majorName}`}
          className={cx(
            "group/image relative mx-5 mt-5 block aspect-[4/3]",
            "overflow-hidden rounded-2xl",
            "border border-border/70",
            "bg-surface-muted",
            "outline-none",
            focusRing
          )}
        >
          <Image
            src={plan.imagePath}
            alt={altText}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover/image:scale-[1.025]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          />

          {/* Hover overlay */}
          <span
            className={[
              "absolute inset-0 flex items-center justify-center",
              "bg-overlay/30 opacity-0",
              "transition-opacity duration-300",
              "group-hover/image:opacity-100",
            ].join(" ")}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-black/25 text-white backdrop-blur-md">
              <Maximize2
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
          </span>
        </button>

        {/* Action */}
        <div className="mt-auto px-5 pb-5 pt-4">
          <button
            type="button"
            onClick={() => setIsFullSize(true)}
            className={cx(
              "inline-flex w-full items-center justify-center gap-2",
              "rounded-xl border border-border/70",
              "bg-background/60 px-4 py-2.5",
              "text-sm font-medium text-foreground",
              "transition-all duration-200",
              "hover:border-primary/20",
              "hover:bg-primary/5",
              "hover:text-primary",
              focusRing
            )}
          >
            <Maximize2
              className="h-4 w-4"
              aria-hidden="true"
            />

            {translate("studyPlans.viewFullSize")}
          </button>
        </div>
      </article>

      {/* Full-size viewer */}
      {isFullSize ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={majorName}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
        >
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setIsFullSize(false)}
            className="fixed inset-0 animate-fade-in bg-overlay/90 backdrop-blur-sm"
          />

          <div className="relative z-10 flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-2xl animate-fade-in">
            {/* Viewer header */}
            <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {translate("studyPlans.heading")}
                </p>

                <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {majorName}
                </h3>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsFullSize(false)}
                aria-label={translate(
                  "studyPlans.closeViewer"
                )}
                className={cx(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center",
                  "rounded-xl border border-border/70",
                  "text-foreground",
                  "transition-colors duration-200",
                  "hover:bg-surface-muted",
                  focusRing
                )}
              >
                <X
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Viewer image */}
            <div className="relative flex-1 overflow-auto bg-surface-muted p-3 sm:p-5">
              <Image
                src={plan.imagePath}
                alt={altText}
                width={plan.width}
                height={plan.height}
                className="mx-auto h-auto max-h-[78vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}