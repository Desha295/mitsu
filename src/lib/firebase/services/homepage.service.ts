/**
 * Homepage service (Sprint 2.2). Backs the homepage Quick Access
 * section's future dynamic content (src/data/home.ts's
 * quickAccessItems, once migrated — not in this sprint's scope).
 */
import { createFirestoreService } from "./createFirestoreService";
import { getHomepageCollection, type QuickAccessItemDoc } from "../collections";

export const homepageService = createFirestoreService<QuickAccessItemDoc>(
  getHomepageCollection
);
