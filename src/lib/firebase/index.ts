/**
 * Firebase — public entry point.
 *
 * Sprint 2.1 — Firebase Foundation: re-exports the initialized SDK
 * instances (config.ts) and typed collection/document reference helpers
 * (collections.ts).
 *
 * Sprint 2.2 — Firebase Services: adds query helpers (query-helpers.ts),
 * the Storage helper (storage.ts), and every domain service
 * (services/index.ts).
 *
 * Future code can simply
 * `import { db, announcementsService, uploadImage } from "@/lib/firebase"`
 * without needing to know the internal file layout.
 */
export * from "./config";
export * from "./collections";
export * from "./query-helpers";
export * from "./storage";
export * from "./services";
