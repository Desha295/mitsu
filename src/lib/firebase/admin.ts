import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "[MITSU] Firebase Admin is not configured. Check FIREBASE_ADMIN_* in .env.local."
    );
  }

const normalizedPrivateKey = privateKey
  .replace(/^["']|["']$/g, "")
  .replace(/\\n/g, "\n")
  .trim();
  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: normalizedPrivateKey,
    }),
  });
}

export function getFirebaseAdmin() {
  const adminApp = getAdminApp();
  return {
    adminDb: getFirestore(adminApp),
    adminAuth: getAuth(adminApp),
    adminMessaging: getMessaging(adminApp),
  };
}
