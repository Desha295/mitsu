/**
 * Site Settings service (Sprint 5.0). Reuses the `settings/general`
 * document reference already defined in Sprint 2.1 — Firebase
 * Foundation — via the new createFirestoreDocService factory (this
 * sprint), since it's a singleton document, not a collection.
 */
import { createFirestoreDocService } from "./createFirestoreDocService";
import { getSettingsDocRef, type SettingsDoc } from "../collections";

export const settingsService =
  createFirestoreDocService<SettingsDoc>(getSettingsDocRef);
