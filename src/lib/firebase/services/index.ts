/**
 * Firebase Services — public entry point (Sprint 2.2).
 * Re-exports every domain service plus the generic factory they're all
 * built on, so future code can `import { announcementsService } from
 * "@/lib/firebase/services"`.
 */
export * from "./createFirestoreService";
export * from "./hero.service";
export * from "./homepage.service";
export * from "./announcements.service";
export * from "./events.service";
export * from "./union.service";
export * from "./systems.service";
export * from "./guide.service";
