/**
 * Reusable Firebase Storage helper (Sprint 2.2 — Firebase Services).
 *
 * Every function takes the storage `path` as a parameter — no hardcoded
 * paths anywhere in this file, per this sprint's requirement. Callers
 * (future upload UI, not built in this sprint) decide the path, e.g.
 * `images/announcements/${id}.jpg`.
 *
 * Mirrors config.ts's existing safety pattern: throws a clear, explicit
 * error if Storage isn't configured yet, rather than silently failing or
 * crashing with an unrelated Firebase SDK error.
 */
import {
  deleteObject,
  getDownloadURL as getFirebaseDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./config";

function requireStorage() {
  if (!storage) {
    throw new Error(
      "[MITSU] Firebase Storage is not configured yet. Fill in .env.local " +
        "using .env.local.example once a Firebase project exists."
    );
  }
  return storage;
}

/**
 * Uploads a file to Firebase Storage at `path` and returns its public
 * download URL.
 */
export async function uploadImage(
  path: string,
  file: File | Blob
): Promise<string> {
  const storageInstance = requireStorage();
  const storageRef = ref(storageInstance, path);
  const result = await uploadBytes(storageRef, file);
  return getFirebaseDownloadURL(result.ref);
}

/**
 * Uploads a document (e.g. a PDF) to Firebase Storage at `path` and
 * returns its public download URL (Sprint 3.10). Identical
 * implementation to `uploadImage` — Storage's `uploadBytes` doesn't
 * care about content type — kept as its own named export so callers
 * managing documents don't call something named "uploadImage" for a
 * PDF. `uploadImage` itself is untouched.
 */
export async function uploadDocument(
  path: string,
  file: File | Blob
): Promise<string> {
  const storageInstance = requireStorage();
  const storageRef = ref(storageInstance, path);
  const result = await uploadBytes(storageRef, file);
  return getFirebaseDownloadURL(result.ref);
}

/** Deletes the file at `path` from Firebase Storage. */
export async function deleteImage(path: string): Promise<void> {
  const storageInstance = requireStorage();
  const storageRef = ref(storageInstance, path);
  await deleteObject(storageRef);
}

/** Retrieves the current public download URL for the file at `path`. */
export async function getDownloadURL(path: string): Promise<string> {
  const storageInstance = requireStorage();
  const storageRef = ref(storageInstance, path);
  return getFirebaseDownloadURL(storageRef);
}
