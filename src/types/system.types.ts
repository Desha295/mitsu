/**
 * Mirrors the /systems/{systemId} Firestore collection.
 * Source of truth: 06_FIREBASE_SCHEMA.md #7
 */
export interface UniversitySystem {
  id: string;
  name: string;
  description: string;
  purpose: string;
  officialUrl: string;
  icon?: string;
  instructions?: string;
  order: number;
  isActive: boolean;
}
