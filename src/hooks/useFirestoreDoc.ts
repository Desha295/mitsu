"use client";

import { useEffect, useState } from "react";
import type { DocumentData } from "firebase/firestore";
import type {
  FirestoreDocService,
  WithId,
} from "@/lib/firebase/services/createFirestoreDocService";

export interface FirestoreDocState<T extends DocumentData> {
  /** The document, or `null` while loading/on error/if it doesn't exist yet. */
  data: WithId<T> | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Singleton-document counterpart to useFirestoreList (Sprint 4, Phase
 * 4.0). Wraps a FirestoreDocService's `get()` the same way
 * useFirestoreList wraps `getAll()` — same loading/error tracking, same
 * cancelled-guard, same "stable service reference" assumption. Added in
 * Sprint 5.0 for Settings; not a new pattern, just the doc-shaped twin
 * of the existing list hook.
 */
export function useFirestoreDoc<T extends DocumentData>(
  service: FirestoreDocService<T>
): FirestoreDocState<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    service
      .get()
      .then((doc) => {
        if (cancelled) return;
        setData(doc);
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
  }, [service]);

  return { data, loading, error };
}
