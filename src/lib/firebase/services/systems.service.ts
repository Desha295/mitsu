/**
 * University Systems service (Sprint 2.2). Reuses the `systems`
 * collection reference already defined in Sprint 2.1 — Firebase
 * Foundation. Backs /systems's future dynamic content
 * (src/data/systems.ts, once migrated — not in this sprint's scope).
 */
import { createFirestoreService } from "./createFirestoreService";
import { getSystemsCollection, type SystemDoc } from "../collections";

export const systemsService = createFirestoreService<SystemDoc>(
  getSystemsCollection
);
