/**
 * Mirrors the /committees/{committeeId} Firestore collection.
 * Source of truth: 06_FIREBASE_SCHEMA.md #8
 */
export interface Committee {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}
