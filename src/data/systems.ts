import type { UniversitySystem } from "@/types/system.types";

/**
 * Placeholder data shaped like the /systems Firestore collection
 * (06_FIREBASE_SCHEMA.md #7). Real content — descriptions, purposes,
 * official URLs, instructions — will be supplied later and/or migrated
 * into Firestore via the Admin Dashboard (Phase 4). Do not treat the
 * text below as official; it exists only to give Phase 1 components a
 * typed shape to render against.
 */
export const systems: UniversitySystem[] = [
  {
    id: "banner",
    name: "Banner",
    description: "Placeholder — official description pending.",
    purpose: "Placeholder — official purpose pending.",
    officialUrl: "",
    order: 1,
    isActive: false,
  },
  {
    id: "smart-learning",
    name: "Smart Learning",
    description: "Placeholder — official description pending.",
    purpose: "Placeholder — official purpose pending.",
    officialUrl: "",
    order: 2,
    isActive: false,
  },
  {
    id: "muster",
    name: "MUSTER",
    description: "Placeholder — official description pending.",
    purpose: "Placeholder — official purpose pending.",
    officialUrl: "",
    order: 3,
    isActive: false,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Placeholder — official description pending.",
    purpose: "Placeholder — official purpose pending.",
    officialUrl: "",
    order: 4,
    isActive: false,
  },
  {
    id: "outlook",
    name: "Outlook",
    description: "Placeholder — official description pending.",
    purpose: "Placeholder — official purpose pending.",
    officialUrl: "",
    order: 5,
    isActive: false,
  },
];
