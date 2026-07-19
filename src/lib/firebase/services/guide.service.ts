/**
 * Freshman Guide service (Sprint 2.2). Backs /guide's Freshman Guide
 * section's future dynamic content (src/data/guide.ts's guideSections,
 * once migrated — not in this sprint's scope).
 *
 * Note: Study Plans (src/data/studyPlans.ts) are a natural fit for the
 * existing `documents` collection (Sprint 2.1) — "downloadable
 * resources" per 06_FIREBASE_SCHEMA.md #11 — and can reuse
 * `documentsService`-style CRUD in a future sprint rather than needing
 * a separate collection here.
 */
import { createFirestoreService } from "./createFirestoreService";
import { getGuideCollection, type GuideSectionDoc } from "../collections";

export const guideService = createFirestoreService<GuideSectionDoc>(
  getGuideCollection
);
