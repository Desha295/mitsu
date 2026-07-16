/**
 * Official study plan reference images (Sprint 1.4).
 * These are official documents provided by the Student Union — displayed
 * as reference images only. Their contents are never extracted, OCR'd,
 * rewritten, or summarized (AI_INSTRUCTIONS.md: "Treat them as reference
 * images. Display them only.").
 *
 * width/height are the images' real intrinsic dimensions, required for
 * correct next/image usage without layout shift (05_ARCHITECTURE.md #14:
 * "Images must use Next.js Image optimization").
 */

export interface StudyPlan {
  id: string;
  majorNameKey: string;
  imagePath: string;
  imageAltKey: string;
  width: number;
  height: number;
  order: number;
}

export const studyPlans: StudyPlan[] = [
  {
    id: "general",
    majorNameKey: "studyPlans.items.general.name",
    imagePath: "/images/study-plans/general-major.png",
    imageAltKey: "studyPlans.items.general.alt",
    width: 1304,
    height: 723,
    order: 1,
  },
  {
    id: "computer-science",
    majorNameKey: "studyPlans.items.computerScience.name",
    imagePath: "/images/study-plans/computer-science-major.png",
    imageAltKey: "studyPlans.items.computerScience.alt",
    width: 1306,
    height: 737,
    order: 2,
  },
  {
    id: "artificial-intelligence",
    majorNameKey: "studyPlans.items.artificialIntelligence.name",
    imagePath: "/images/study-plans/artificial-intelligence-major.png",
    imageAltKey: "studyPlans.items.artificialIntelligence.alt",
    width: 1303,
    height: 737,
    order: 3,
  },
  {
    id: "information-systems",
    majorNameKey: "studyPlans.items.informationSystems.name",
    imagePath: "/images/study-plans/information-systems-major.png",
    imageAltKey: "studyPlans.items.informationSystems.alt",
    width: 1300,
    height: 731,
    order: 4,
  },
];
