"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { cx, focusRing } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmingLabel?: string;
  cancelLabel: string;
  /** Shows a warning icon and stronger emphasis for irreversible actions (e.g. delete). */
  destructive?: boolean;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Generic confirmation dialog (components/admin, Sprint 3.3). First
 * consumer is Announcements' delete action, but built generic (no
 * announcement-specific text) so future list pages (Events, Union,
 * Systems, etc.) reuse it instead of each rolling their own — per
 * 07_COMPONENT_RULES.md's "Modal" example and #11 "check if a similar
 * component already exists" before adding a new one.
 *
 * Reuses the same overlay/motion tokens as components/layout/MobileMenu
 * (bg-overlay, animate-fade-in) rather than introducing new ones. Only
 * Blue (primary) is used for the destructive warning accent — no red —
 * per 04_DESIGN_SYSTEM.md's locked brand palette.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  cancelLabel,
  destructive = false,
  confirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-overlay px-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {destructive && (
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <h2 id="confirm-dialog-title" className="text-base font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-foreground/70">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={cx(
              "rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
              focusRing
            )}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className={cx(
              "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark disabled:opacity-60",
              focusRing
            )}
          >
            {confirming ? (confirmingLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
