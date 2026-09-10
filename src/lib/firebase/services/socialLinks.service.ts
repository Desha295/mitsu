/**
 * Social Links service.
 * Provides access to the admin-managed `socialLinks` collection.
 */
import { createFirestoreService } from "./createFirestoreService";
import {
  getSocialLinksCollection,
  type SocialLinkDoc,
} from "../collections";

export const socialLinksService =
  createFirestoreService<SocialLinkDoc>(
    getSocialLinksCollection
  );
