import {
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

import {
  getNotificationsCollection,
  type NotificationDoc,
} from "../collections";

import { createFirestoreService } from "./createFirestoreService";

export const notificationService =
  createFirestoreService<NotificationDoc>(
    getNotificationsCollection
  );

export async function getPublishedNotifications(
  maxResults = 30
) {
  return notificationService.getAll({
    filters: [
      {
        field: "isPublished",
        op: "==",
        value: true,
      },
    ],
    orderByField: {
      field: "createdAt",
      direction: "desc",
    },
    pageSize: maxResults,
  });
}

/**
 * Deletes all notification documents from Firestore.
 *
 * This is an admin-only operation. Firestore security rules
 * are responsible for ensuring that only authenticated admins
 * can perform the delete operation.
 */
export async function deleteAllNotifications(): Promise<void> {
  const notificationsRef =
    getNotificationsCollection();

  if (!notificationsRef) {
    throw new Error(
      "[MITSU] Firebase is not configured yet — cannot delete notifications."
    );
  }

  const snapshot =
    await getDocs(
      collection(
        notificationsRef.firestore,
        notificationsRef.path
      )
    );

  if (snapshot.empty) {
    return;
  }

  await Promise.all(
    snapshot.docs.map((notification) =>
      deleteDoc(notification.ref)
    )
  );
}