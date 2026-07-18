/**
 * About MITSU page data (Sprint 1.7).
 *
 * This describes the MITSU *platform* — identity, vision, mission, and
 * core values — sourced from 01_PROJECT_IDENTITY.md. It is intentionally
 * distinct from src/data/union.ts's `unionOverview` (Sprint 1.5), which
 * describes the Student Union *organization*. The two are related but
 * not the same thing, so their content is not merged or duplicated.
 *
 * Types are defined inline here, consistent with the Sprint 1.4-1.6
 * precedent (no new src/types/* file, since this sprint's approved file
 * list doesn't include one). Text fields are translation keys; actual
 * EN/AR copy lives in src/locales/en.json and ar.json under "about.*".
 */

export interface PlatformGoal {
  id: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

export const aboutContent = {
  headingKey: "about.heading",
  introductionKey: "about.introduction",
  visionHeadingKey: "about.visionHeading",
  visionKey: "about.vision",
  missionHeadingKey: "about.missionHeading",
  missionKey: "about.mission",
  goalsHeadingKey: "about.goalsHeading",
  goalsSubheadingKey: "about.goalsSubheading",
  mottoKey: "about.motto",
};

/**
 * The platform's 8 core values (01_PROJECT_IDENTITY.md "Core Values"),
 * presented on the About page as "Platform goals".
 */
export const platformGoals: PlatformGoal[] = [
  {
    id: "student-first",
    icon: "Heart",
    titleKey: "about.goals.studentFirst.title",
    descriptionKey: "about.goals.studentFirst.description",
  },
  {
    id: "official",
    icon: "ShieldCheck",
    titleKey: "about.goals.official.title",
    descriptionKey: "about.goals.official.description",
  },
  {
    id: "simple",
    icon: "Sparkles",
    titleKey: "about.goals.simple.title",
    descriptionKey: "about.goals.simple.description",
  },
  {
    id: "accessible",
    icon: "Accessibility",
    titleKey: "about.goals.accessible.title",
    descriptionKey: "about.goals.accessible.description",
  },
  {
    id: "reliable",
    icon: "BadgeCheck",
    titleKey: "about.goals.reliable.title",
    descriptionKey: "about.goals.reliable.description",
  },
  {
    id: "scalable",
    icon: "TrendingUp",
    titleKey: "about.goals.scalable.title",
    descriptionKey: "about.goals.scalable.description",
  },
  {
    id: "maintainable",
    icon: "Wrench",
    titleKey: "about.goals.maintainable.title",
    descriptionKey: "about.goals.maintainable.description",
  },
  {
    id: "professional",
    icon: "Award",
    titleKey: "about.goals.professional.title",
    descriptionKey: "about.goals.professional.description",
  },
];
