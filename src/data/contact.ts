/**
 * Contact page data (Sprint 1.7).
 *
 * President contact and official social links are NOT duplicated here —
 * they're imported directly from src/data/union.ts (Sprint 1.5), which
 * remains their single source of truth. This file only adds what didn't
 * exist yet: office information and official communication channels.
 *
 * Office location, hours, and a direct email address have not been
 * provided by the Student Union. Rather than inventing plausible-looking
 * official details, `officeInfo` entries omit `valueKey` for anything
 * not yet confirmed — ContactCard renders those as "Coming soon"
 * (00_PROJECT_RULES.md #17 "never invent policies/information", #27
 * "do not assume, do not invent, mark for review instead").
 *
 * Types are defined inline here, consistent with the Sprint 1.4-1.6
 * precedent (no new src/types/* file).
 */

export interface OfficeInfoItem {
  id: string;
  icon: string;
  labelKey: string;
  /** Omitted when the real value isn't confirmed yet — renders "Coming soon". */
  valueKey?: string;
}

export interface CommunicationChannel {
  id: string;
  icon: string;
  nameKey: string;
  descriptionKey: string;
  href: string;
}

export const officeInfo: OfficeInfoItem[] = [
  {
    id: "location",
    icon: "MapPin",
    labelKey: "contact.office.location",
    // No valueKey yet — exact office location within the faculty building
    // hasn't been confirmed.
  },
  {
    id: "hours",
    icon: "Clock",
    labelKey: "contact.office.hours",
    // No valueKey yet — office hours haven't been confirmed.
  },
  {
    id: "email",
    icon: "Mail",
    labelKey: "contact.office.email",
    // No valueKey yet — no official contact email has been provided.
  },
  {
    id: "phone",
    icon: "Phone",
    labelKey: "contact.office.phone",
    // No valueKey yet — no official contact phone number has been
    // provided. Sprint 6.1: this is the fourth office-info item; like
    // location/email before it, ContactSection now reads a live value
    // from Settings (contactPhone) where set, falling back to the same
    // "Coming soon" treatment.
  },
];

/**
 * Official communication channels not already covered by
 * unionSocialLinks (Sprint 1.5). WhatsApp Community and the Union's
 * Facebook/Instagram/Faculty Group are shown separately in
 * SocialLinksSection, so they aren't repeated here.
 */
export const communicationChannels: CommunicationChannel[] = [
  {
    id: "advisor-teams",
    icon: "Video",
    nameKey: "contact.channels.advisorTeams.name",
    descriptionKey: "contact.channels.advisorTeams.description",
    href: "https://teams.microsoft.com/",
  },
];
