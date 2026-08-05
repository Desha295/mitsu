/**
 * Generic Firestore singleton-document service factory (Sprint 5.0 —
 * Site Settings Foundation).
 *
 * Mirrors createFirestoreService.ts's factory pattern exactly, but for
 * a single fixed-path document (e.g. /settings/general) instead of a
 * queried collection — this is the "new singleton-document service
 * shape" the project's own backlog (PROJECT_STATE.md / CURRENT_SPRINT.md)
 * had flagged as needed before Settings could be built, since
 * createFirestoreService's getAll/create/remove don't make sense for a
 * document that's never listed, created-with-an-auto-id, or deleted.
 *
 * Uses `setDoc(ref, data, { merge: true })` for `update`, not
 * `updateDoc`. This intentionally collapses "create if missing" and
 * "update if present" into one operation — appropriate here because a
 * singleton settings document has no meaningful "doesn't exist yet"
 * state to branch on (unlike Hero's multi-document collection, where
 * create vs. update is a real distinction). This also sidesteps the
 * exact bug class fixed in Hero's admin page (an undefined field
 * surviving to a raw `addDoc`/`updateDoc` call) for any future caller
 * of this factory, since merge-set only ever touches the fields it's
 * given.
 */
import {
  getDoc,
  setDoc,
  type DocumentData,
  type DocumentReference,
  type PartialWithFieldValue,
} from "firebase/firestore";
import type { WithId } from "./createFirestoreService";

export type { WithId } from "./createFirestoreService";

export interface FirestoreDocService<T extends DocumentData> {
  /** Fetches the document, or `null` if it doesn't exist yet. */
  get: () => Promise<WithId<T> | null>;
  /** Creates or merge-updates the document — no separate create/update. */
  update: (data: PartialWithFieldValue<T>) => Promise<void>;
}

function requireDoc<T extends DocumentData>(
  ref: DocumentReference<T> | null,
  action: string
): DocumentReference<T> {
  if (!ref) {
    throw new Error(
      `[MITSU] Firebase is not configured yet — cannot ${action}. Fill in ` +
        ".env.local using .env.local.example once a Firebase project exists."
    );
  }
  return ref;
}

export function createFirestoreDocService<T extends DocumentData>(
  getDocRef: () => DocumentReference<T> | null
): FirestoreDocService<T> {
  return {
    async get() {
      const ref = getDocRef();
      if (!ref) return null;

      const docSnap = await getDoc(ref);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    },

    async update(data) {
      const ref = requireDoc(getDocRef(), "save settings");
      await setDoc(ref, data, { merge: true });
    },
  };
}
