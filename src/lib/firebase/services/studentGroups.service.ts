/**
 * Student Groups service.
 * Provides access to the admin-managed `studentGroups` collection.
 */
import { createFirestoreService } from "./createFirestoreService";
import {
  getStudentGroupsCollection,
  type StudentGroupDoc,
} from "../collections";

export const studentGroupsService =
  createFirestoreService<StudentGroupDoc>(
    getStudentGroupsCollection
  );