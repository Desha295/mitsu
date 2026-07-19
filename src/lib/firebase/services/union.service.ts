/**
 * Student Union service (Sprint 2.2). Reuses the `committees` collection
 * reference already defined in Sprint 2.1 — Firebase Foundation, since
 * committees are the Student Union domain's primary multi-document
 * entity (7 records, the clearest fit for generic CRUD).
 *
 * Note: Leadership (President/Vice President) already has its own
 * dedicated collection reference too (`getLeadershipCollection`, Sprint
 * 2.1) and can back a separate, more granular service in a future sprint
 * if needed — not duplicated here since CURRENT_SPRINT.md names exactly
 * one "Student Union" service, not two.
 */
import { createFirestoreService } from "./createFirestoreService";
import { getCommitteesCollection, type CommitteeDoc } from "../collections";

export const unionService = createFirestoreService<CommitteeDoc>(
  getCommitteesCollection
);
