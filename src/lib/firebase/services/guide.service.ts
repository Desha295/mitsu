/**
 * Freshman Guide service.
 *
 * Handles guide section CRUD and notification delivery.
 *
 * Notification behavior:
 * - Creating an active guide section creates a notification.
 * - Creating an inactive guide section does not create a notification.
 * - Updating a guide section does NOT notify students by default.
 * - An admin can explicitly request a notification when updating.
 * - Deactivating a guide section removes its notification.
 * - Deleting a guide section removes its notification.
 */

import {
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  type WithFieldValue,
} from "firebase/firestore";

import {
  getGuideCollection,
  getNotificationsCollection,
  type GuideSectionDoc,
  type NotificationDoc,
} from "../collections";

import { createFirestoreService } from "./createFirestoreService";

export const guideService =
  createFirestoreService<GuideSectionDoc>(
    getGuideCollection
  );

interface UpdateGuideOptions {
  notify?: boolean;
}

/**
 * Creates or updates the notification associated
 * with an active guide section.
 *
 * Inactive guide sections do not have notifications.
 */
async function createGuideNotification(
  guideId: string,
  guide: GuideSectionDoc
): Promise<void> {
  const notificationsRef =
    getNotificationsCollection();

  if (!notificationsRef) {
    throw new Error(
      "[MITSU] Firebase is not configured yet — cannot create guide notification."
    );
  }

  // Inactive guide section = no notification.
  if (!guide.isActive) {
    return;
  }

  const notificationRef = doc(
    notificationsRef,
    `guide_${guideId}`
  );

  const notificationData:
    WithFieldValue<NotificationDoc> = {
    titleAr: guide.titleAr,
    titleEn: guide.titleEn,
    descriptionAr: guide.descriptionAr,
    descriptionEn: guide.descriptionEn,
    type: "guide",

    // Deep-link directly to the guide section.
    href: `/guide?highlight=${encodeURIComponent(
      guideId
    )}`,

    isPublished: true,

    // A notification created/re-created because of an
    // important update should appear as a new notification.
    createdAt: Timestamp.now(),
  };

  await setDoc(
    notificationRef,
    notificationData
  );
}

/**
 * Removes the notification associated with a guide section.
 */
export async function removeGuideNotification(
  guideId: string
): Promise<void> {
  const notificationsRef =
    getNotificationsCollection();

  if (!notificationsRef) {
    throw new Error(
      "[MITSU] Firebase is not configured yet — cannot remove guide notification."
    );
  }

  await deleteDoc(
    doc(
      notificationsRef,
      `guide_${guideId}`
    )
  );
}

/**
 * Creates a guide section.
 *
 * If the guide section is active, a notification is created.
 * If it is inactive, no notification is created.
 */
export async function createGuide(
  data: GuideSectionDoc
): Promise<string> {
  const id =
    await guideService.create(data);

  await createGuideNotification(
    id,
    data
  );

  return id;
}

/**
 * Updates an existing guide section.
 *
 * By default, updating a guide section does NOT
 * create or recreate its notification.
 *
 * If notify=true:
 * - The updated guide is fetched from Firestore.
 * - Its notification is created/updated.
 *
 * If isActive=false:
 * - The associated notification is removed.
 */
export async function updateGuide(
  id: string,
  data: Partial<GuideSectionDoc>,
  options: UpdateGuideOptions = {}
): Promise<void> {
  await guideService.update(
    id,
    data
  );

  // Deactivated guide section = remove its notification.
  if (data.isActive === false) {
    await removeGuideNotification(id);
    return;
  }

  // No explicit notification request.
  if (!options.notify) {
    return;
  }

  // Get the complete updated guide from Firestore.
  const updated =
    await guideService.getById(id);

  if (!updated) {
    return;
  }

  // Recreate/update the notification using
  // the latest guide content.
  await createGuideNotification(
    id,
    updated
  );
}

/**
 * Deletes a guide section and its associated notification.
 */
export async function removeGuide(
  id: string
): Promise<void> {
  await guideService.remove(id);

  await removeGuideNotification(
    id
  );
}