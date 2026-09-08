/**
 * Announcements service (Sprint 2.2 — Firebase Services).
 *
 * Handles announcement CRUD through the shared Firestore service.
 *
 * Notification behavior:
 * - Creating a published announcement creates a notification.
 * - Creating a draft does not create a notification.
 * - Updating an announcement does NOT notify students by default.
 * - An admin can explicitly request a notification when updating.
 * - Unpublishing an announcement removes its notification.
 * - Deleting an announcement removes its notification.
 */

import {
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  type WithFieldValue,
} from "firebase/firestore";

import {
  getAnnouncementsCollection,
  getNotificationsCollection,
  type AnnouncementDoc,
  type NotificationDoc,
} from "../collections";

import { createFirestoreService } from "./createFirestoreService";

export const announcementsService =
  createFirestoreService<AnnouncementDoc>(
    getAnnouncementsCollection
  );

interface UpdateAnnouncementOptions {
  /**
   * When true, the update also creates/updates
   * the notification associated with the announcement.
   *
   * Defaults to false.
   */
  notify?: boolean;
}

/**
 * Creates or updates the notification associated
 * with an announcement.
 */
async function createAnnouncementNotification(
  announcementId: string,
  announcement: AnnouncementDoc
): Promise<void> {
  const notificationsRef =
    getNotificationsCollection();

  if (!notificationsRef) {
    throw new Error(
      "[MITSU] Firebase is not configured yet — cannot create announcement notification."
    );
  }

  // Draft announcement = no notification.
  if (!announcement.isPublished) {
    return;
  }

  const notificationRef = doc(
    notificationsRef,
    `announcement_${announcementId}`
  );

  const notificationData:
    WithFieldValue<NotificationDoc> = {
    titleAr: announcement.title,
    titleEn: announcement.titleEn,
    descriptionAr: announcement.description,
    descriptionEn: announcement.descriptionEn,
    type: "announcement",

    // Deep-link directly to the announcement.
    href: `/announcements?highlight=${encodeURIComponent(
      announcementId
    )}`,

    isPublished: true,
    createdAt:
      announcement.createdAt ?? Timestamp.now(),
  };

  // Only add imageUrl when it actually has a value.
  if (announcement.imageUrl?.trim()) {
    notificationData.imageUrl =
      announcement.imageUrl.trim();
  }

  await setDoc(
    notificationRef,
    notificationData
  );
}

/**
 * Removes the notification associated with an announcement.
 */
export async function removeAnnouncementNotification(
  announcementId: string
): Promise<void> {
  const notificationsRef =
    getNotificationsCollection();

  if (!notificationsRef) {
    throw new Error(
      "[MITSU] Firebase is not configured yet — cannot remove announcement notification."
    );
  }

  await deleteDoc(
    doc(
      notificationsRef,
      `announcement_${announcementId}`
    )
  );
}

/**
 * Creates an announcement.
 *
 * If the announcement is published, a notification is created.
 * If it is a draft, no notification is created.
 */
export async function createAnnouncement(
  data: AnnouncementDoc
): Promise<string> {
  const id =
    await announcementsService.create(data);

  await createAnnouncementNotification(
    id,
    data
  );

  return id;
}

/**
 * Updates an existing announcement.
 *
 * By default, updating an announcement does NOT
 * create or recreate its notification.
 *
 * An admin can explicitly request a notification:
 *
 * updateAnnouncement(id, data, { notify: true })
 *
 * When an announcement is unpublished, its existing
 * notification is removed automatically.
 */
export async function updateAnnouncement(
  id: string,
  data: Partial<AnnouncementDoc> & {
    updatedAt: AnnouncementDoc["updatedAt"];
  },
  options: UpdateAnnouncementOptions = {}
): Promise<void> {
  await announcementsService.update(
    id,
    data
  );

  // If the announcement was unpublished,
  // make sure its notification is removed.
  if (data.isPublished === false) {
    await removeAnnouncementNotification(id);
    return;
  }

  // Normal edits should not notify students.
  if (!options.notify) {
    return;
  }

  // When explicitly requested, fetch the complete
  // updated announcement and create/update its notification.
  const updated =
    await announcementsService.getById(id);

  if (!updated) {
    return;
  }

  await createAnnouncementNotification(
    id,
    updated
  );
}

/**
 * Deletes an announcement and its associated notification.
 */
export async function removeAnnouncement(
  id: string
): Promise<void> {
  await announcementsService.remove(id);

  await removeAnnouncementNotification(
    id
  );
}