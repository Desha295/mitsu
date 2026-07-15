/**
 * Generic Lucide icon names used for placeholder social entries.
 * Lucide does not ship brand/logo icons (by design), so these are
 * neutral stand-ins until official brand assets and real links exist.
 */
export type SocialIconName = "MessageCircle" | "Users" | "Camera";

export interface SocialLink {
  id: string;
  /** Translation key resolved via translate(), e.g. "footer.social.whatsapp" */
  labelKey: string;
  /** Empty string = placeholder, not yet an official link */
  href: string;
  icon: SocialIconName;
}
