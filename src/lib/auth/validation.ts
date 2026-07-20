/**
 * File-validation helpers (Sprint 2.3 — Security Foundation).
 *
 * Fast, friendly client-side pre-checks before attempting an upload.
 * These are NOT the security boundary — storage.rules enforces the same
 * limits server-side regardless of whether this function was called.
 * This just gives a future upload UI a way to reject an oversized/wrong
 * -type file immediately instead of waiting on a round trip.
 */
import {
  ALLOWED_IMAGE_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  MAX_IMAGE_SIZE_BYTES,
} from "./constants";

export function isValidImageFile(file: File): boolean {
  return (
    (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type) &&
    file.size <= MAX_IMAGE_SIZE_BYTES
  );
}

export function isValidDocumentFile(file: File): boolean {
  return file.size <= MAX_DOCUMENT_SIZE_BYTES;
}
