import { createFirestoreService } from "./createFirestoreService";
import {
  getFamiliesCollection,
  type FamilyDoc,
} from "../collections";

export const familiesService =
  createFirestoreService<FamilyDoc>(
    getFamiliesCollection
  );