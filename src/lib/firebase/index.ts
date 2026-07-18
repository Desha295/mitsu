/**
 * Firebase Foundation — public entry point (Sprint 2.1).
 *
 * Re-exports the initialized SDK instances (config.ts) and the typed
 * collection/document reference helpers (collections.ts), so future code
 * can simply `import { db, getAnnouncementsCollection } from "@/lib/firebase"`
 * without needing to know the internal file layout.
 */
export * from "./config";
export * from "./collections";
