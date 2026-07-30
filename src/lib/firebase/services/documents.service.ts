/**
 * Documents service (Sprint 3.10). Wraps the `documents` collection
 * reference that has existed since Sprint 2.1 — Firebase Foundation —
 * but was never wrapped in a service until now, the same situation
 * `leadershipService` was in before Sprint 3.9. Same
 * `createFirestoreService` factory as every other domain service; no
 * new backend architecture introduced. Backs the admin Study Plans /
 * Documents management page — downloadable resources per
 * 06_FIREBASE_SCHEMA.md #11 (Student Guide, Regulations, PDFs, etc.).
 */
import { createFirestoreService } from "./createFirestoreService";
import { getDocumentsCollection, type DocumentResourceDoc } from "../collections";

export const documentsService = createFirestoreService<DocumentResourceDoc>(
  getDocumentsCollection
);
