import { createFirestoreService } from "./createFirestoreService";
import {
  getFamilyEventsCollection,
  type FamilyEventDoc,
} from "../collections";

export const createFamilyEventsService = (familyId: string) =>
  createFirestoreService<FamilyEventDoc>(
    () => getFamilyEventsCollection(familyId)
  );