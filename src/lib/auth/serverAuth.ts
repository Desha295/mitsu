import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, type AdminDoc } from "@/lib/firebase/collections";
import { ROLES } from "./constants";
import type { UserRole } from "./types";

export interface ServerAdmin {
  uid: string;
  email: string;
  role: UserRole;
}

export async function requireServerAdmin(
  authorizationHeader: string | null
): Promise<ServerAdmin> {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const idToken = authorizationHeader.slice("Bearer ".length).trim();

  if (!idToken) {
    throw new Error("UNAUTHORIZED");
  }

  const decodedToken = await adminAuth.verifyIdToken(idToken);

  const adminSnapshot = await adminDb
    .collection(COLLECTIONS.admins)
    .doc(decodedToken.uid)
    .get();

  if (!adminSnapshot.exists) {
    throw new Error("FORBIDDEN");
  }

  const adminData = adminSnapshot.data() as AdminDoc;

  if (
    adminData.role !== ROLES.admin &&
    adminData.role !== ROLES.superAdmin
  ) {
    throw new Error("FORBIDDEN");
  }

  return {
    uid: decodedToken.uid,
    email: adminData.email,
    role: adminData.role,
  };
}