/**
 * Announcements service (Sprint 2.2). Reuses the `announcements`
 * collection reference already defined in Sprint 2.1 — Firebase
 * Foundation. Backs /announcements's future dynamic content
 * (src/data/announcements.ts, once migrated — not in this sprint's
 * scope).
 */
import { createFirestoreService } from "./createFirestoreService";
import { getAnnouncementsCollection, type AnnouncementDoc } from "../collections";

export const announcementsService = createFirestoreService<AnnouncementDoc>(
  getAnnouncementsCollection
);
