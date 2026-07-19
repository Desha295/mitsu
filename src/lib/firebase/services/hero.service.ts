/**
 * Hero service (Sprint 2.2). Backs the homepage Hero section's future
 * dynamic content (src/data/home.ts's heroData, once migrated — not in
 * this sprint's scope).
 */
import { createFirestoreService } from "./createFirestoreService";
import { getHeroCollection, type HeroDoc } from "../collections";

export const heroService = createFirestoreService<HeroDoc>(getHeroCollection);
