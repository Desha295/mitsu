/**
 * Freshman Guide data (Sprint 1.4).
 * Academic rules below are official information provided by the Student
 * Union — used verbatim, not invented (00_PROJECT_RULES.md #17: "Never
 * invent policies"). Text fields are translation keys; actual EN/AR copy
 * lives in src/locales/en.json and ar.json under "guide.sections.*".
 */

export interface GuideStat {
  labelKey: string;
  value: string;
}

export interface GuideSection {
  id: string;
  /** Lucide icon name */
  icon: string;
  titleKey: string;
  descriptionKey: string;
  /** Short fact bullets shown when the card is expanded */
  factKeys?: string[];
  /** Numeric stat chips shown when expanded (e.g. credit hour breakdown) */
  stats?: GuideStat[];
  /** Visually highlighted card — used for Important Notes */
  highlight?: boolean;
  order: number;
}

export const guideSections: GuideSection[] = [
  {
    id: "introduction",
    icon: "Compass",
    titleKey: "guide.sections.introduction.title",
    descriptionKey: "guide.sections.introduction.description",
    order: 1,
  },
  {
    id: "registration-process",
    icon: "CalendarCheck",
    titleKey: "guide.sections.registrationProcess.title",
    descriptionKey: "guide.sections.registrationProcess.description",
    factKeys: ["guide.sections.registrationProcess.facts.advisorRegisters"],
    order: 2,
  },
  {
    id: "academic-advisor",
    icon: "UserCheck",
    titleKey: "guide.sections.academicAdvisor.title",
    descriptionKey: "guide.sections.academicAdvisor.description",
    factKeys: ["guide.sections.academicAdvisor.facts.teamsOnly"],
    order: 3,
  },
  {
    id: "credit-hour-system",
    icon: "GraduationCap",
    titleKey: "guide.sections.creditHourSystem.title",
    descriptionKey: "guide.sections.creditHourSystem.description",
    stats: [
      { labelKey: "guide.sections.creditHourSystem.stats.year1", value: "36" },
      { labelKey: "guide.sections.creditHourSystem.stats.year2", value: "36" },
      { labelKey: "guide.sections.creditHourSystem.stats.year3", value: "36" },
      { labelKey: "guide.sections.creditHourSystem.stats.year4", value: "32" },
      { labelKey: "guide.sections.creditHourSystem.stats.summer", value: "9" },
      {
        labelKey: "guide.sections.creditHourSystem.stats.graduationSummer",
        value: "12",
      },
      { labelKey: "guide.sections.creditHourSystem.stats.total", value: "140" },
    ],
    order: 4,
  },
  {
    id: "gpa-rules",
    icon: "BarChart3",
    titleKey: "guide.sections.gpaRules.title",
    descriptionKey: "guide.sections.gpaRules.description",
    factKeys: ["guide.sections.gpaRules.facts.belowTwo"],
    order: 5,
  },
  {
    id: "summer-registration",
    icon: "Sun",
    titleKey: "guide.sections.summerRegistration.title",
    descriptionKey: "guide.sections.summerRegistration.description",
    stats: [
      { labelKey: "guide.sections.summerRegistration.stats.summer", value: "9" },
      {
        labelKey: "guide.sections.summerRegistration.stats.graduationSummer",
        value: "12",
      },
    ],
    order: 6,
  },
  {
    id: "overload-rules",
    icon: "Zap",
    titleKey: "guide.sections.overloadRules.title",
    descriptionKey: "guide.sections.overloadRules.description",
    factKeys: ["guide.sections.overloadRules.facts.cgpaAboveThree"],
    order: 7,
  },
  {
    id: "important-notes",
    icon: "AlertTriangle",
    titleKey: "guide.sections.importantNotes.title",
    descriptionKey: "guide.sections.importantNotes.description",
    factKeys: [
      "guide.sections.importantNotes.facts.advisorRegisters",
      "guide.sections.importantNotes.facts.teamsOnly",
      "guide.sections.importantNotes.facts.gpaBelowTwo",
      "guide.sections.importantNotes.facts.overload",
    ],
    highlight: true,
    order: 8,
  },
];
