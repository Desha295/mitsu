/**
 * Typed Firestore collection reference helpers.
 *
 * Originally created in Sprint 2.1 — Firebase Foundation with 8
 * collections (announcements/events/systems/committees/leadership/
 * settings/documents/admins). Extended in Sprint 2.2 — Firebase Services
 * with 3 more (hero/homepage/guide), needed to back the Hero, Homepage,
 * and Freshman Guide services. All Sprint 2.1 exports are unchanged;
 * this file was only appended to, never rewritten.
 *
 * These functions only return typed `CollectionReference`/`DocumentReference`
 * objects — they do NOT call `getDocs`, `addDoc`, `setDoc`, `onSnapshot`,
 * or any other read/write operation themselves. Actual CRUD lives in
 * services/createFirestoreService.ts (Sprint 2.2), which wraps these
 * references with getAll/getById/create/update/remove.
 *
 * Document field shapes mirror 06_FIREBASE_SCHEMA.md exactly for the
 * original 8 collections; the 3 Sprint 2.2 additions mirror their
 * equivalent local data files (src/data/home.ts, guide.ts) instead, since
 * they predate any formal schema entry. All getters return `null` when
 * Firebase isn't configured yet, matching config.ts's existing safety
 * pattern — calling code must handle the `null` case rather than assume
 * a connection exists.
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
  // Added in Sprint 2.2 to back the Hero/Homepage/Guide services — these
  // domains didn't have a dedicated collection in the original Phase 0
  // schema (06_FIREBASE_SCHEMA.md documents the original 8 above; adding
  // new collections as the app grows is expected — see that doc's own
  // "Future Collections" section).
  hero: "hero",
  homepage: "homepage",
  guide: "guide",
  // Added in Sprint 7.0 — Faculty Leadership CMS. Distinct from
  // `leadership` (Student Union leadership) above; not a rename.
  facultyLeadership: "facultyLeadership",
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

/**
 * Faculty Leadership (Sprint 7.0 — new collection, distinct from
 * `leadership` above). `leadership` is Student Union leadership
 * (President/Vice President); this is Faculty-level leadership (e.g.
 * Dean, Vice Deans) — a different concept, not a rename or replacement
 * of the existing collection.
 */
export interface FacultyLeadershipDoc {
  name: string;
  role: string;
  imageUrl?: string;
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
  /**
   * Sprint 5.0 — additive. No admin page or public consumer existed for
   * this collection before this sprint, so extending the schema here
   * doesn't touch any established behavior. Left optional and unset by
   * default (never invented) per 00_PROJECT_RULES.md #17/#27 — the
   * admin fills these in once real office contact details are
   * confirmed; until then, public consumers fall back to their
   * existing "Coming soon" treatment exactly as before this sprint.
   */
  contactEmail?: string;
  contactPhone?: string;
  officeLocation?: string;
  /**
   * Sprint 6.1 — additive, same reasoning as the three fields above:
   * no existing consumer depended on the prior shape. Used by
   * UnionHeroSection to override its existing static hero-image slot
   * when set.
   */
  unionLogoUrl?: string;
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
// Document shapes added in Sprint 2.2 (Hero/Homepage/Guide services).
// Mirror the equivalent local data files (src/data/home.ts, guide.ts)
// field-for-field, so a future migration sprint can map them 1:1.
// ---------------------------------------------------------------------------

export interface HeroDoc {
  heading: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  isActive: boolean;
  updatedAt: Timestamp;
}

/** One document per Quick Access card (src/data/home.ts's quickAccessItems). */
export interface QuickAccessItemDoc {
  title: string;
  description: string;
  href: string;
  icon: string;
  order: number;
  isActive: boolean;
}

/** One document per Freshman Guide topic (src/data/guide.ts's guideSections). */
export interface GuideSectionDoc {
  icon: string;
  title: string;
  description: string;
  facts?: string[];
  stats?: Array<{ label: string; value: string }>;
  highlight?: boolean;
  order: number;
  isActive: boolean;
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

export function getFacultyLeadershipCollection(): CollectionReference<FacultyLeadershipDoc> | null {
  return getTypedCollection<FacultyLeadershipDoc>(COLLECTIONS.facultyLeadership);
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

// ---------------------------------------------------------------------------
// Collection reference helpers added in Sprint 2.2
// ---------------------------------------------------------------------------

export function getHeroCollection(): CollectionReference<HeroDoc> | null {
  return getTypedCollection<HeroDoc>(COLLECTIONS.hero);
}

export function getHomepageCollection(): CollectionReference<QuickAccessItemDoc> | null {
  return getTypedCollection<QuickAccessItemDoc>(COLLECTIONS.homepage);
}

export function getGuideCollection(): CollectionReference<GuideSectionDoc> | null {
  return getTypedCollection<GuideSectionDoc>(COLLECTIONS.guide);
}
