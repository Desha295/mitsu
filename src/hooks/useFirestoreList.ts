"use client";

import { useEffect, useState } from "react";
import type { DocumentData } from "firebase/firestore";
import type {
  FirestoreService,
  WithId,
} from "@/lib/firebase/services/createFirestoreService";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

export interface FirestoreListState<T extends DocumentData> {
  /** Documents returned by the service, or an empty array while loading/on error. */
  data: Array<WithId<T>>;
  loading: boolean;
  error: Error | null;
}

/**
 * Minimal client-side data-fetching hook (Sprint 4 — Phase 4.0).
 *
 * Wraps an existing FirestoreService's `getAll()` in a `useEffect` and
 * tracks loading/error state, so public sections read live Firestore
 * data through the same services already used by the admin dashboard,
 * without each section hand-rolling its own fetch boilerplate.
 *
 * This is the one small piece of shared code Sprint 4 introduces — not
 * a generic Firestore layer, just this hook — per 07_COMPONENT_RULES.md
 * §8 (components talk to Firebase only via hooks/services).
 */
export function useFirestoreList<T extends DocumentData>(
  service: FirestoreService<T>,
  options?: QueryOptions<T>
): FirestoreListState<T> {
  const [data, setData] = useState<Array<WithId<T>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Note: loading/error are intentionally NOT reset synchronously here
    // (only from within the async callbacks below) — matching
    // react-hooks' set-state-in-effect rule, which flags setState calls
    // made directly in an effect body. `loading` already starts `true`
    // and `error` already starts `null` via useState, which covers this
    // hook's actual Sprint 4 usage (service/options are stable singleton
    // references, so this effect only runs once per mount).
    service
      .getAll(options)
      .then((docs) => {
        if (cancelled) return;
        setData(docs);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [service, options]);

  return { data, loading, error };
}
