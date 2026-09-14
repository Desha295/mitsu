/**
 * Events service.
 *
 * Handles event CRUD and notification delivery.
 *
 * Notification behavior:
 * - Creating a published event creates a notification.
 * - Creating a draft does not create a notification.
 * - Updating an event does NOT notify students by default.
 * - An admin can explicitly request a notification when updating.
 * - Unpublishing an event removes its notification.
 * - Deleting an event removes its notification.
 */

import {
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  type WithFieldValue,
} from "firebase/firestore";

import {
  getEventsCollection,
  getNotificationsCollection,
  type EventDoc,
  type NotificationDoc,
} from "../collections";

import { createFirestoreService } from "./createFirestoreService";

export const eventsService =
  createFirestoreService<EventDoc>(
    getEventsCollection
  );

interface UpdateEventOptions {
  /**
   * When true, the update also creates/updates
   * the notification associated with the event.
   *
   * Defaults to false.
   */
  notify?: boolean;
}

/**
 * Creates or updates the notification associated
 * with an event.
 */
async function createEventNotification(
  eventId: string,
  event: EventDoc
): Promise<void> {
  const notificationsRef =
    getNotificationsCollection();

  if (!notificationsRef) {
    throw new Error(
      "[MITSU] Firebase is not configured yet — cannot create event notification."
    );
  }

  // Draft event = no notification.
  if (!event.isPublished) {
    return;
  }

  const notificationRef = doc(
    notificationsRef,
    `event_${eventId}`
  );

  const notificationData:
    WithFieldValue<NotificationDoc> = {
    titleAr: event.titleAr,
    titleEn: event.titleEn,
    descriptionAr: event.descriptionAr,
    descriptionEn: event.descriptionEn,
    type: "event",

    // Deep-link directly to the event page.
    href: `/events?highlight=${encodeURIComponent(
      eventId
    )}`,

    isPublished: true,
    createdAt:
      event.createdAt ?? Timestamp.now(),
  };

  // Only add imageUrl when it actually has a value.
  if (event.imageUrl?.trim()) {
    notificationData.imageUrl =
      event.imageUrl.trim();
  }

  await setDoc(
    notificationRef,
    notificationData
  );
}

/**
 * Removes the notification associated with an event.
 */
export async function removeEventNotification(
  eventId: string
): Promise<void> {
  const notificationsRef =
    getNotificationsCollection();

  if (!notificationsRef) {
    throw new Error(
      "[MITSU] Firebase is not configured yet — cannot remove event notification."
    );
  }

  await deleteDoc(
    doc(
      notificationsRef,
      `event_${eventId}`
    )
  );
}

/**
 * Creates an event.
 *
 * If the event is published, a notification is created.
 * If it is a draft, no notification is created.
 */
export async function createEvent(
  data: EventDoc
): Promise<string> {
  const id =
    await eventsService.create(data);

  await createEventNotification(
    id,
    data
  );

  return id;
}

/**
 * Updates an existing event.
 *
 * By default, updating an event does NOT
 * create or recreate its notification.
 *
 * An admin can explicitly request a notification:
 *
 * updateEvent(id, data, { notify: true })
 *
 * When an event is unpublished, its existing
 * notification is removed automatically.
 *
 * EventDoc does not contain updatedAt,
 * so no updatedAt field is added here.
 */
export async function updateEvent(
  id: string,
  data: Partial<EventDoc>,
  options: UpdateEventOptions = {}
): Promise<void> {
  await eventsService.update(
    id,
    data
  );

  // If the event was unpublished,
  // make sure its notification is removed.
  if (data.isPublished === false) {
    await removeEventNotification(id);
    return;
  }

  // Normal edits should not notify students.
  if (!options.notify) {
    return;
  }

  // When explicitly requested, fetch the complete
  // updated event and create/update its notification.
  const updated =
    await eventsService.getById(id);

  if (!updated) {
    return;
  }

  await createEventNotification(
    id,
    updated
  );
}

/**
 * Deletes an event and its associated notification.
 */
export async function removeEvent(
  id: string
): Promise<void> {
  await eventsService.remove(id);

  await removeEventNotification(
    id
  );
}