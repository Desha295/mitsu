/**
 * Typed Firestore collection reference helpers (Sprint 2.1 — Firebase
 * Foundation).
 *
 * These functions only return typed `CollectionReference`/`DocumentReference`
 * objects — they do NOT call `getDocs`, `addDoc`, `setDoc`, `onSnapshot`,
 * or any other read/write operation. Actual CRUD services are explicitly
 * out of scope for this sprint (see CURRENT_SPRINT.md) and are reserved
 * for Sprint 2.2 — Firebase Services (10_ROADMAP.md), which will build
 * generic CRUD/query/pagination helpers on top of this foundation.
 *
 * Document field shapes mirror 06_FIREBASE_SCHEMA.md exactly (collection
 * names, field names, and types) so future services can rely on them
 * without redefining the schema. All getters return `null` when Firebase
 * isn't configured yet, matching config.ts's existing safety pattern —
 * calling code must handle the `null` case rather than assume a
 * connection exists.
 */
import {
  collection,
  doc,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./config";

/** Canonical collection names — single source of truth for path strings. */
export const COLLECTIONS = {
  announcements: "announcements",
  events: "events",
  systems: "systems",
  committees: "committees",
  leadership: "leadership",
  settings: "settings",
  documents: "documents",
  admins: "admins",
} as const;

// ---------------------------------------------------------------------------
// Document shapes (06_FIREBASE_SCHEMA.md #5-12)
// ---------------------------------------------------------------------------

export interface AnnouncementDoc {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  priority: "normal" | "important" | "urgent";
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EventDoc {
  title: string;
  description: string;
  date: Timestamp;
  location?: string;
  imageUrl?: string;
  category?: string;
  isPublished: boolean;
  createdAt: Timestamp;
}

export interface SystemDoc {
  name: string;
  description: string;
  purpose: string;
  officialUrl: string;
  icon?: string;
  instructions?: string;
  order: number;
  isActive: boolean;
}

export interface CommitteeDoc {
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

export interface LeadershipDoc {
  name: string;
  position: string;
  imageUrl?: string;
  bio?: string;
  order: number;
  isActive: boolean;
}

/** Single document at /settings/general, not a queried collection. */
export interface SettingsDoc {
  projectName: string;
  universityName: string;
  logoUrl: string;
  universityLogoUrl: string;
  campusImageUrl: string;
  whatsappCommunityUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  updatedAt: Timestamp;
}

export interface DocumentResourceDoc {
  title: string;
  description: string;
  fileUrl: string;
  category: string;
  uploadedAt: Timestamp;
  isPublished: boolean;
}

export interface AdminDoc {
  email: string;
  role: "admin" | "super_admin";
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Generic typed converter + reference helpers
// ---------------------------------------------------------------------------

/**
 * Pass-through Firestore converter. Its only job is to give
 * `CollectionReference`/`DocumentReference` a concrete TypeScript type via
 * `withConverter`, so Sprint 2.2's services get typed reads/writes for
 * free instead of redefining this boilerplate per collection.
 */
function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return data;
    },
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): T {
      return snapshot.data(options) as T;
    },
  };
}

function getTypedCollection<T extends DocumentData>(
  path: string
): CollectionReference<T> | null {
  if (!db) return null;
  return collection(db, path).withConverter(createConverter<T>());
}

function getTypedDoc<T extends DocumentData>(
  path: string,
  id: string
): DocumentReference<T> | null {
  if (!db) return null;
  return doc(db, path, id).withConverter(createConverter<T>());
}

// ---------------------------------------------------------------------------
// Collection reference helpers
// ---------------------------------------------------------------------------

export function getAnnouncementsCollection(): CollectionReference<AnnouncementDoc> | null {
  return getTypedCollection<AnnouncementDoc>(COLLECTIONS.announcements);
}

export function getEventsCollection(): CollectionReference<EventDoc> | null {
  return getTypedCollection<EventDoc>(COLLECTIONS.events);
}

export function getSystemsCollection(): CollectionReference<SystemDoc> | null {
  return getTypedCollection<SystemDoc>(COLLECTIONS.systems);
}

export function getCommitteesCollection(): CollectionReference<CommitteeDoc> | null {
  return getTypedCollection<CommitteeDoc>(COLLECTIONS.committees);
}

export function getLeadershipCollection(): CollectionReference<LeadershipDoc> | null {
  return getTypedCollection<LeadershipDoc>(COLLECTIONS.leadership);
}

export function getDocumentsCollection(): CollectionReference<DocumentResourceDoc> | null {
  return getTypedCollection<DocumentResourceDoc>(COLLECTIONS.documents);
}

export function getAdminsCollection(): CollectionReference<AdminDoc> | null {
  return getTypedCollection<AdminDoc>(COLLECTIONS.admins);
}

/** /settings/general is a single document, so this returns a DocumentReference, not a CollectionReference. */
export function getSettingsDocRef(): DocumentReference<SettingsDoc> | null {
  return getTypedDoc<SettingsDoc>(COLLECTIONS.settings, "general");
}
