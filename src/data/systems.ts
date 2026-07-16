import type { UniversitySystem } from "@/types/system.types";

/**
 * Official university systems directory (Sprint 1.3).
 * URLs and category/required metadata provided directly by the Student
 * Union — used verbatim, not invented. Text content (name/description/
 * instructions) is stored as translation keys; actual EN/AR copy lives in
 * src/locales/en.json and ar.json under "systems.items.*".
 *
 * Shape mirrors the future /systems Firestore collection
 * (06_FIREBASE_SCHEMA.md #7). No Firebase integration yet — Sprint 1.3
 * explicitly excludes Firebase; this remains local static data for now.
 */
export const systems: UniversitySystem[] = [
  {
    id: "banner",
    nameKey: "systems.items.banner.name",
    descriptionKey: "systems.items.banner.description",
    instructionsKey: "systems.items.banner.instructions",
    officialUrl:
      "https://register.must.edu.eg/StudentRegistrationSsb/ssb/registration",
    icon: "ClipboardList",
    category: "academic",
    required: true,
    order: 1,
    isActive: true,
  },
  {
    id: "smart-learning",
    nameKey: "systems.items.smartLearning.name",
    descriptionKey: "systems.items.smartLearning.description",
    instructionsKey: "systems.items.smartLearning.instructions",
    officialUrl: "https://smartlearning.must.edu.eg/login/index.php",
    icon: "BookOpen",
    category: "academic",
    required: true,
    order: 2,
    isActive: true,
  },
  {
    id: "muster",
    nameKey: "systems.items.muster.name",
    descriptionKey: "systems.items.muster.description",
    instructionsKey: "systems.items.muster.instructions",
    // No official web portal yet — MUSTER is a mobile app only.
    officialUrl: "",
    icon: "Smartphone",
    category: "student-services",
    required: true,
    order: 3,
    isActive: true,
  },
  {
    id: "teams",
    nameKey: "systems.items.teams.name",
    descriptionKey: "systems.items.teams.description",
    instructionsKey: "systems.items.teams.instructions",
    officialUrl: "https://teams.microsoft.com/",
    icon: "Video",
    category: "communication",
    required: true,
    order: 4,
    isActive: true,
  },
  {
    id: "outlook",
    nameKey: "systems.items.outlook.name",
    descriptionKey: "systems.items.outlook.description",
    instructionsKey: "systems.items.outlook.instructions",
    officialUrl: "https://outlook.office.com/",
    icon: "Mail",
    category: "communication",
    required: true,
    order: 5,
    isActive: true,
  },
];

/**
 * Microsoft account password reset — relevant to Teams, Outlook, and
 * MUSTER, all of which require university-account sign-in. Kept here
 * (not hardcoded in a component) per Sprint 1.3 instruction to keep all
 * URLs inside this data file.
 */
export const PASSWORD_RESET_URL = "https://passwordreset.microsoftonline.com/";
