import {
  getStudentsCollection,
  type StudentDoc,
} from "@/lib/firebase/collections";
import { createFirestoreService } from "./createFirestoreService";

export const studentsService = createFirestoreService<StudentDoc>(
  getStudentsCollection
);