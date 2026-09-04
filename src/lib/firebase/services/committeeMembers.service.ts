import { createFirestoreService } from "./createFirestoreService";
import {
  getCommitteeMembersCollection,
  type CommitteeMemberDoc,
} from "../collections";

export const committeeMembersService =
  createFirestoreService<CommitteeMemberDoc>(
    getCommitteeMembersCollection
  );