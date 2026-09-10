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
  students: "students",
  notifications: "notifications",
  families: "families",
  socialLinks: "socialLinks",
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

/**
 * Student academic advisor record.
 *
 * Firestore document ID:
 * - Student ID
 *
 * Excel mapping:
 * - اسم المرشد الأكاديمي → advisorName
 * - الرقم الجامعي → studentId
 * - اسم الطالب → studentName
 * - الفرقة → semester
 *
 * `semester` represents the student's current semester
 * and ranges from 1 to 8.
 */
export interface StudentDoc {
  studentId: string;
  studentName: string;
  advisorName: string;
  semester: number;
  academicTerm: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Student Families
// ---------------------------------------------------------------------------

/**
 * Student Family.
 *
 * Optional contact/application fields are intentionally omitted from
 * the public UI when they are not provided.
 */
export interface FamilyDoc {
  nameAr: string;
  nameEn: string;

  descriptionAr: string;
  descriptionEn: string;

  imageUrl?: string;

  whatsapp?: string;
  email?: string;
  phone?: string;

  instagram?: string;
  facebook?: string;
  linkedin?: string;

  applicationUrl?: string;

  order: number;
  isActive: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Event / activity belonging to a specific Student Family.
 *
 * Stored as a subcollection:
 * /families/{familyId}/events/{eventId}
 */
export interface FamilyEventDoc {
  titleAr: string;
  titleEn: string;

  descriptionAr?: string;
  descriptionEn?: string;

  imageUrl: string;

  date: Timestamp;

  createdAt: Timestamp;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

/**
 * Notification type.
 *
 * Used to identify the source/content category of the notification.
 */
export type NotificationType =
  | "announcement"
  | "event"
  | "guide"
  | "system"
  | "document"
  | "general";

/**
 * Site notification.
 *
 * Read/unread state is intentionally NOT stored here.
 * It will be tracked per browser/device using localStorage.
 */
export interface NotificationDoc {
  titleAr: string;
  titleEn: string;

  descriptionAr: string;
  descriptionEn: string;

  type: NotificationType;

  /**
   * Internal site route or external URL that the notification opens.
   */
  href: string;

  /**
   * Optional image/icon associated with the notification.
   */
  imageUrl?: string;

  /**
   * Controls whether the notification is visible to users.
   */
  isPublished: boolean;

  /**
   * Creation timestamp used for ordering notifications.
   */
  createdAt: Timestamp;

  /**
   * Optional expiration date.
   * If provided, the notification can be hidden after this timestamp.
   */
  expiresAt?: Timestamp;
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

export interface SocialLinkDoc {
  nameAr: string;
  nameEn: string;
  url: string;
  icon: string;
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

export function getStudentsCollection(): CollectionReference<StudentDoc> | null {
  return getTypedCollection<StudentDoc>(COLLECTIONS.students);
}

export function getNotificationsCollection(): CollectionReference<NotificationDoc> | null {
  return getTypedCollection<NotificationDoc>(
    COLLECTIONS.notifications
  );
}

export function getFamiliesCollection(): CollectionReference<FamilyDoc> | null {
  return getTypedCollection<FamilyDoc>(COLLECTIONS.families);
}

export function getSocialLinksCollection(): CollectionReference<SocialLinkDoc> | null {
  return getTypedCollection<SocialLinkDoc>(
    COLLECTIONS.socialLinks
  );
}

/**
 * Returns the events subcollection for a specific Student Family.
 *
 * Firestore path:
 * /families/{familyId}/events
 */
export function getFamilyEventsCollection(
  familyId: string
): CollectionReference<FamilyEventDoc> | null {
  return getTypedCollection<FamilyEventDoc>(
    `${COLLECTIONS.families}/${familyId}/events`
  );
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
