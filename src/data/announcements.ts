/**
 * Announcements & Events data (Sprint 1.6).
 *
 * Shape mirrors the future /announcements and /events Firestore
 * collections (06_FIREBASE_SCHEMA.md #5-6) so this migrates cleanly once
 * Firebase is introduced (Phase 2+). No Firebase, admin, or CRUD in this
 * sprint — this remains local static data per DATA_ARCHITECTURE.md's
 * "Static Phase".
 *
 * IMPORTANT: the announcements and events below are SAMPLE/PLACEHOLDER
 * content only — no real Student Union announcements or events were
 * provided for this sprint. They exist to give the page real structure
 * to render (dates, categories, priority, featured item) and must be
 * replaced with actual content before this section goes live. This is
 * distinct from Sprints 1.3/1.4/1.5, where real official data was given.
 *
 * Types are defined inline here, consistent with the Sprint 1.4/1.5
 * precedent (no new src/types/* file, since this sprint's approved file
 * list doesn't include one). Text fields are translation keys; actual
 * EN/AR copy lives in src/locales/en.json and ar.json under
 * "announcements.items.*" and "events.items.*".
 */

export type AnnouncementPriority = "normal" | "important" | "urgent";

export type AnnouncementCategory =
  | "academic"
  | "deadline"
  | "general"
  | "event"
  | "orientation";

export interface Announcement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  /** ISO date string (e.g. "2026-07-15") */
  date: string;
  /** Marks the single announcement shown in the featured slot */
  featured?: boolean;
}

export type EventCategory =
  | "academic"
  | "orientation"
  | "cultural"
  | "sports"
  | "social";

export interface Event {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: EventCategory;
  /** ISO date string (e.g. "2026-09-01") */
  date: string;
  locationKey?: string;
}

export const announcements: Announcement[] = [
  {
    id: "fall-registration-open",
    titleKey: "announcements.items.fallRegistrationOpen.title",
    descriptionKey: "announcements.items.fallRegistrationOpen.description",
    category: "deadline",
    priority: "urgent",
    date: "2026-07-15",
    featured: true,
  },
  {
    id: "orientation-schedule-released",
    titleKey: "announcements.items.orientationScheduleReleased.title",
    descriptionKey:
      "announcements.items.orientationScheduleReleased.description",
    category: "orientation",
    priority: "important",
    date: "2026-07-10",
  },
  {
    id: "new-study-spaces",
    titleKey: "announcements.items.newStudySpaces.title",
    descriptionKey: "announcements.items.newStudySpaces.description",
    category: "general",
    priority: "normal",
    date: "2026-07-05",
  },
  {
    id: "ai-guest-lecture",
    titleKey: "announcements.items.aiGuestLecture.title",
    descriptionKey: "announcements.items.aiGuestLecture.description",
    category: "event",
    priority: "normal",
    date: "2026-07-01",
  },
  {
    id: "library-hours-extended",
    titleKey: "announcements.items.libraryHoursExtended.title",
    descriptionKey: "announcements.items.libraryHoursExtended.description",
    category: "general",
    priority: "important",
    date: "2026-06-28",
  },
  {
    id: "committee-applications-open",
    titleKey: "announcements.items.committeeApplicationsOpen.title",
    descriptionKey:
      "announcements.items.committeeApplicationsOpen.description",
    category: "general",
    priority: "normal",
    date: "2026-06-20",
  },
  {
    id: "wifi-maintenance",
    titleKey: "announcements.items.wifiMaintenance.title",
    descriptionKey: "announcements.items.wifiMaintenance.description",
    category: "general",
    priority: "urgent",
    date: "2026-06-15",
  },
  {
    id: "hackathon-winners",
    titleKey: "announcements.items.hackathonWinners.title",
    descriptionKey: "announcements.items.hackathonWinners.description",
    category: "academic",
    priority: "normal",
    date: "2026-06-10",
  },
];

export const events: Event[] = [
  {
    id: "orientation-day",
    titleKey: "events.items.orientationDay.title",
    descriptionKey: "events.items.orientationDay.description",
    category: "orientation",
    date: "2026-09-01",
    locationKey: "events.items.orientationDay.location",
  },
  {
    id: "programming-competition",
    titleKey: "events.items.programmingCompetition.title",
    descriptionKey: "events.items.programmingCompetition.description",
    category: "academic",
    date: "2026-09-10",
    locationKey: "events.items.programmingCompetition.location",
  },
  {
    id: "cultural-night",
    titleKey: "events.items.culturalNight.title",
    descriptionKey: "events.items.culturalNight.description",
    category: "cultural",
    date: "2026-09-20",
    locationKey: "events.items.culturalNight.location",
  },
  {
    id: "sports-tournament-finals",
    titleKey: "events.items.sportsTournamentFinals.title",
    descriptionKey: "events.items.sportsTournamentFinals.description",
    category: "sports",
    date: "2026-10-05",
    locationKey: "events.items.sportsTournamentFinals.location",
  },
  {
    id: "career-fair",
    titleKey: "events.items.careerFair.title",
    descriptionKey: "events.items.careerFair.description",
    category: "academic",
    date: "2026-10-15",
    locationKey: "events.items.careerFair.location",
  },
  {
    id: "community-charity-trip",
    titleKey: "events.items.communityCharityTrip.title",
    descriptionKey: "events.items.communityCharityTrip.description",
    category: "social",
    date: "2026-10-25",
    locationKey: "events.items.communityCharityTrip.location",
  },
];
