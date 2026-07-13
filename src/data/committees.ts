import type { Committee } from "@/types/committee.types";

/**
 * Placeholder data shaped like the /committees Firestore collection
 * (06_FIREBASE_SCHEMA.md #8). Real committee names/descriptions will be
 * provided by the Student Union and/or managed via the Admin Dashboard.
 */
export const committees: Committee[] = [
  {
    id: "scientific",
    name: "Scientific Committee",
    description: "Placeholder — official description pending.",
    isActive: false,
    order: 1,
  },
  {
    id: "cultural",
    name: "Cultural Committee",
    description: "Placeholder — official description pending.",
    isActive: false,
    order: 2,
  },
  {
    id: "sports",
    name: "Sports Committee",
    description: "Placeholder — official description pending.",
    isActive: false,
    order: 3,
  },
  {
    id: "social",
    name: "Social Committee",
    description: "Placeholder — official description pending.",
    isActive: false,
    order: 4,
  },
  {
    id: "media",
    name: "Media Committee",
    description: "Placeholder — official description pending.",
    isActive: false,
    order: 5,
  },
];
