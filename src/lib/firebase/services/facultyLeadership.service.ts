/**
 * Faculty Leadership service (Sprint 7.0). New collection, distinct
 * from `leadership` (Student Union). Reuses the same
 * createFirestoreService factory as every other domain service.
 */
import { createFirestoreService } from "./createFirestoreService";
import { getFacultyLeadershipCollection, type FacultyLeadershipDoc } from "../collections";

export const facultyLeadershipService = createFirestoreService<FacultyLeadershipDoc>(
  getFacultyLeadershipCollection
);
