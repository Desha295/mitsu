"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import type { StudyPlan } from "@/data/studyPlans";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface StudyPlanCardProps {
  plan: StudyPlan;
}

/**
 * Displays an official study plan as a reference image only — its
 * contents are never extracted, OCR'd, rewritten, or summarized
 * (AI_INSTRUCTIONS.md: "Treat them as reference images. Display them
 * only."). "View Full Size" opens an accessible full-screen viewer of
 * the same image.
 *
 * The full-size viewer follows the same accessible-dialog conventions
 * already established by MobileMenu (Sprint 1.1): focus moves in on
 * open, Escape closes, background scroll locks, focus returns to the
 * trigger on close. Kept self-contained in this component rather than
 * extracted into a new shared file, per Sprint 1.4's approved file list.
 */
export function StudyPlanCard({ plan }: StudyPlanCardProps) {
  const { translate } = useLanguage();
  const [isFullSize, setIsFullSize] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isFullSize) return;

    const triggerElement = triggerRef.current;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFullSize(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      triggerElement?.focus();
    };
  }, [isFullSize]);

  const majorName = translate(plan.majorNameKey);
  const altText = translate(plan.imageAltKey);

  return (
    <>
      <div className="flex flex-col rounded-lg border border-border bg-surface p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-sm font-semibold text-foreground">{majorName}</h3>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsFullSize(true)}
          aria-label={`${translate("studyPlans.viewFullSize")} — ${majorName}`}
          className={cx(
            "group relative mt-3 aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface-muted",
            focusRing
          )}
        >
          <Image
            src={plan.imagePath}
            alt={altText}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-overlay opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Maximize2 className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsFullSize(true)}
          className={cx(
            "mt-3 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
            focusRing
          )}
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
          {translate("studyPlans.viewFullSize")}
        </button>
      </div>

      {isFullSize && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={majorName}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setIsFullSize(false)}
            className="fixed inset-0 animate-fade-in bg-overlay"
          />
          <div className="relative z-10 flex max-h-full w-full max-w-5xl flex-col animate-fade-in rounded-lg bg-surface p-4 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-foreground">
                {majorName}
              </h3>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsFullSize(false)}
                aria-label={translate("studyPlans.closeViewer")}
                className={cx(
                  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors duration-150 hover:bg-surface-muted",
                  focusRing
                )}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative mt-4 flex-1 overflow-auto">
              <Image
                src={plan.imagePath}
                alt={altText}
                width={plan.width}
                height={plan.height}
                className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
