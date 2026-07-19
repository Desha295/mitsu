/**
 * Events service (Sprint 2.2). Reuses the `events` collection reference
 * already defined in Sprint 2.1 — Firebase Foundation. Backs
 * /announcements's Events section future dynamic content
 * (src/data/announcements.ts's events, once migrated — not in this
 * sprint's scope).
 */
import { createFirestoreService } from "./createFirestoreService";
import { getEventsCollection, type EventDoc } from "../collections";

export const eventsService = createFirestoreService<EventDoc>(
  getEventsCollection
);
