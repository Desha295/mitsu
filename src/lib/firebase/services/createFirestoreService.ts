/**
 * Generic Firestore CRUD service factory (Sprint 2.2 — Firebase Services).
 *
 * Wraps a typed collection getter (from ../collections.ts) with
 * getAll/getById/create/update/remove, so every domain service below
 * (hero, homepage, announcements, events, union, systems, guide) is a
 * ~3-line file that just calls this factory — one implementation, zero
 * duplicated CRUD logic across 7 services.
 *
 * Accepts a *getter function* (not an already-resolved reference)
 * because the underlying collection reference is only available once
 * Firebase is configured — re-resolving it on every call keeps every
 * service safe to import even before `.env.local` exists, matching
 * Sprint 2.1's `null`-safe design. `getAll`/`getById` degrade gracefully
 * (empty array / `null`); `create`/`update`/`remove` throw a clear,
 * explicit error instead, since silently no-op'ing a write the caller
 * believes succeeded would be misleading.
 */
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  type CollectionReference,
  type DocumentData,
  type UpdateData,
  type WithFieldValue,
} from "firebase/firestore";
import { buildQuery, type QueryOptions } from "../query-helpers";

export type WithId<T> = T & { id: string };

export interface FirestoreService<T extends DocumentData> {
  /** Fetches every document, optionally ordered/filtered/paginated. */
  getAll: (options?: QueryOptions<T>) => Promise<Array<WithId<T>>>;
  /** Fetches a single document by id, or `null` if it doesn't exist. */
  getById: (id: string) => Promise<WithId<T> | null>;
  /** Creates a new document and returns its generated id. */
  create: (data: WithFieldValue<T>) => Promise<string>;
  /** Updates fields on an existing document. */
  update: (id: string, data: UpdateData<T>) => Promise<void>;
  /** Deletes a document by id. */
  remove: (id: string) => Promise<void>;
}

function requireCollection<T extends DocumentData>(
  ref: CollectionReference<T> | null,
  action: string
): CollectionReference<T> {
  if (!ref) {
    throw new Error(
      `[MITSU] Firebase is not configured yet — cannot ${action}. Fill in ` +
        ".env.local using .env.local.example once a Firebase project exists."
    );
  }
  return ref;
}

export function createFirestoreService<T extends DocumentData>(
  getCollectionRef: () => CollectionReference<T> | null
): FirestoreService<T> {
  return {
    async getAll(options) {
      const ref = getCollectionRef();
      if (!ref) return [];

      const target = options ? buildQuery(ref, options) : ref;
      const snapshot = await getDocs(target);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
    },

    async getById(id) {
      const ref = getCollectionRef();
      if (!ref) return null;

      const docSnap = await getDoc(doc(ref, id));
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    },

    async create(data) {
      const ref = requireCollection(getCollectionRef(), "create a document");
      const created = await addDoc(ref, data);
      return created.id;
    },

    async update(id, data) {
      const ref = requireCollection(getCollectionRef(), "update a document");
      await updateDoc(doc(ref, id), data);
    },

    async remove(id) {
      const ref = requireCollection(getCollectionRef(), "remove a document");
      await deleteDoc(doc(ref, id));
    },
  };
}
