/**
 * Leadership service (Sprint 3.9). Wraps the `leadership` collection
 * reference that has existed since Sprint 2.1 — Firebase Foundation —
 * but was deliberately left unwrapped in Sprint 2.2, when `unionService`
 * was scoped to the `committees` collection only. Same
 * `createFirestoreService` factory as every other domain service; no
 * new backend architecture introduced.
 */
import { createFirestoreService } from "./createFirestoreService";
import { getLeadershipCollection, type LeadershipDoc } from "../collections";

export const leadershipService = createFirestoreService<LeadershipDoc>(
  getLeadershipCollection
);
