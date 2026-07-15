import type { SocialLink } from "@/types/social.types";

/**
 * Placeholder social entries for the Footer (08_BRAND_GUIDELINES.md #15,
 * 06_FIREBASE_SCHEMA.md #10 `settings.whatsappCommunityUrl`/`facebookUrl`/
 * `instagramUrl`). These will eventually be sourced from the Firebase
 * `/settings/general` document (Phase 4 / Firebase Content), which is out
 * of scope for Sprint 1.1. `href` is intentionally empty until then.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "whatsapp",
    labelKey: "footer.social.whatsapp",
    href: "",
    icon: "MessageCircle",
  },
  {
    id: "facebook",
    labelKey: "footer.social.facebook",
    href: "",
    icon: "Users",
  },
  {
    id: "instagram",
    labelKey: "footer.social.instagram",
    href: "",
    icon: "Camera",
  },
];
