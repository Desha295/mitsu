/**
 * Admin authorization foundation (Sprint 2.3 — Security Foundation).
 *
 * Bridges Firebase Auth (who is signed in) with the `admins` Firestore
 * collection (Sprint 2.1) (what role, if any, they have). No admin
 * dashboard consumes this yet — it's the foundation a future one will
 * build on.
 */
import { doc, getDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase/config";
import { COLLECTIONS, type AdminDoc } from "@/lib/firebase/collections";
import { isValidRole } from "./roles";
import type { AuthenticatedAdmin } from "./types";

/**
 * Looks up whether `user` is a registered admin (has a matching
 * `/admins/{uid}` document) and returns their role if so.
 * Returns `null` for signed-out users, unconfigured Firebase, users with
 * no matching admin document, or a document with an unrecognized role
 * value (defensive against malformed data — never grants access on
 * uncertain input).
 */
export async function getAdminForUser(
  user: User | null
): Promise<AuthenticatedAdmin | null> {
  if (!user || !db) return null;

  const adminDocRef = doc(db, COLLECTIONS.admins, user.uid);
  const snapshot = await getDoc(adminDocRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as AdminDoc;
  if (!isValidRole(data.role)) return null;

  return { uid: user.uid, email: data.email, role: data.role };
}
