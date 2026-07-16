/**
 * Mirrors the /systems/{systemId} Firestore collection.
 * Source of truth: 06_FIREBASE_SCHEMA.md #7
 *
 * Sprint 1.3: extended with `category` and `required` to match the official
 * system data provided by the Student Union. Text fields use translation
 * keys (nameKey/descriptionKey/instructionsKey) rather than raw strings,
 * consistent with the pattern already established in data/navigation.ts
 * and data/home.ts — the actual EN/AR copy lives in the locale files.
 */
export type SystemCategory = "academic" | "student-services" | "communication";

export interface UniversitySystem {
  id: string;
  /** Translation key for the system's display name, e.g. "systems.items.banner.name" */
  nameKey: string;
  /** Translation key for the short description shown on the card */
  descriptionKey: string;
  /** Translation key for "how to use" instructions */
  instructionsKey: string;
  /** Official access URL — empty string if not yet available (e.g. MUSTER has no web portal) */
  officialUrl: string;
  /** Lucide icon name (placeholder until official per-system logos are provided) */
  icon: string;
  category: SystemCategory;
  required: boolean;
  order: number;
  isActive: boolean;
}
