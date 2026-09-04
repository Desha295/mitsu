/**
 * Typed Firestore collection reference helpers.
 *
 * Firebase collection references and document shapes.
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
  committeeMembers: "committeeMembers",
  leadership: "leadership",
  settings: "settings",
  documents: "documents",
  admins: "admins",
  hero: "hero",
  homepage: "homepage",
  guide: "guide",
  facultyLeadership: "facultyLeadership",
} as const;

// ---------------------------------------------------------------------------
// Document shapes
// ---------------------------------------------------------------------------

export interface AnnouncementDoc {
  title: string;
  titleEn: string;

  description: string;
  descriptionEn: string;

  category: string;

  imageUrl?: string;

  mediaImageUrl?: string;
  mediaFileUrl?: string;
  mediaVideoUrl?: string;

  priority: "normal" | "important" | "urgent";
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EventDoc {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  date: Timestamp;
  locationAr?: string;
  locationEn?: string;
  imageUrl?: string;
  mediaVideoUrl?: string;
  mediaFileUrl?: string;
  category?: string;
  isPublished: boolean;
  createdAt: Timestamp;
}

export interface SystemDoc {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  purpose: string;
  officialUrl: string;
  icon?: string;
  instructionsAr?: string;
  instructionsEn?: string;
  order: number;
  isActive: boolean;
}

export interface CommitteeDoc {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

/**
 * Individual member of a Student Union committee.
 *
 * Each member belongs to exactly one committee through `committeeId`.
 */
export interface CommitteeMemberDoc {
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  committeeId: string;
  order: number;
}

export interface LeadershipDoc {
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  imageUrl?: string;
  bio?: string;
  order: number;
  isActive: boolean;
}

/**
 * Faculty Leadership.
 * Distinct from Student Union leadership.
 */
export interface FacultyLeadershipDoc {
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

/** Single document at /settings/general. */
export interface SettingsDoc {
  projectName: string;
  universityName: string;
  logoUrl: string;
  universityLogoUrl: string;
  campusImageUrl: string;
  whatsappCommunityUrl: string;
  facebookUrl?: string;
  instagramUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  officeLocation?: string;
  unionLogoUrl?: string;
  updatedAt: Timestamp;
}

export interface DocumentResourceDoc {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  fileUrl: string;
  categoryAr: string;
  categoryEn: string;
  uploadedAt: Timestamp;
  isPublished: boolean;
}

export interface AdminDoc {
  email: string;
  role: "admin" | "super_admin";
  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Hero / Homepage / Guide
// ---------------------------------------------------------------------------

export interface HeroDoc {
  headingAr: string;
  headingEn: string;
  descriptionAr: string;
  descriptionEn: string;
  primaryCtaLabelAr: string;
  primaryCtaLabelEn: string;
  primaryCtaHref: string;
  secondaryCtaLabelAr: string;
  secondaryCtaLabelEn: string;
  secondaryCtaHref: string;
  imageUrl: string;
  isActive: boolean;
  updatedAt: Timestamp;
}

export interface QuickAccessItemDoc {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  href: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface GuideSectionDoc {
  icon: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;

  facts?: Array<{
    ar: string;
    en: string;
  }>;

  stats?: Array<{
    labelAr: string;
    labelEn: string;
    value: string;
  }>;

  highlight?: boolean;
  order: number;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Generic typed converter + reference helpers
// ---------------------------------------------------------------------------

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
  return getTypedCollection<AnnouncementDoc>(
    COLLECTIONS.announcements
  );
}

export function getEventsCollection(): CollectionReference<EventDoc> | null {
  return getTypedCollection<EventDoc>(COLLECTIONS.events);
}

export function getSystemsCollection(): CollectionReference<SystemDoc> | null {
  return getTypedCollection<SystemDoc>(COLLECTIONS.systems);
}

export function getCommitteesCollection(): CollectionReference<CommitteeDoc> | null {
  return getTypedCollection<CommitteeDoc>(
    COLLECTIONS.committees
  );
}

export function getCommitteeMembersCollection(): CollectionReference<CommitteeMemberDoc> | null {
  return getTypedCollection<CommitteeMemberDoc>(
    COLLECTIONS.committeeMembers
  );
}

export function getLeadershipCollection(): CollectionReference<LeadershipDoc> | null {
  return getTypedCollection<LeadershipDoc>(
    COLLECTIONS.leadership
  );
}

export function getFacultyLeadershipCollection(): CollectionReference<FacultyLeadershipDoc> | null {
  return getTypedCollection<FacultyLeadershipDoc>(
    COLLECTIONS.facultyLeadership
  );
}

export function getDocumentsCollection(): CollectionReference<DocumentResourceDoc> | null {
  return getTypedCollection<DocumentResourceDoc>(
    COLLECTIONS.documents
  );
}

export function getAdminsCollection(): CollectionReference<AdminDoc> | null {
  return getTypedCollection<AdminDoc>(COLLECTIONS.admins);
}

/** /settings/general is a single document. */
export function getSettingsDocRef(): DocumentReference<SettingsDoc> | null {
  return getTypedDoc<SettingsDoc>(
    COLLECTIONS.settings,
    "general"
  );
}

// ---------------------------------------------------------------------------
// Hero / Homepage / Guide
// ---------------------------------------------------------------------------

export function getHeroCollection(): CollectionReference<HeroDoc> | null {
  return getTypedCollection<HeroDoc>(COLLECTIONS.hero);
}

export function getHomepageCollection(): CollectionReference<QuickAccessItemDoc> | null {
  return getTypedCollection<QuickAccessItemDoc>(
    COLLECTIONS.homepage
  );
}

export function getGuideCollection(): CollectionReference<GuideSectionDoc> | null {
  return getTypedCollection<GuideSectionDoc>(
    COLLECTIONS.guide
  );
}