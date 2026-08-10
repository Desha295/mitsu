"use client";

import { Container } from "@/components/layout/Container";
import { ContactCard } from "@/components/shared/ContactCard";
import { LeaderCard } from "@/components/shared/LeaderCard";
import { officeInfo, communicationChannels } from "@/data/contact";
import { president } from "@/data/union";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";
import type { SettingsDoc } from "@/lib/firebase/collections";

/**
 * Maps the two office-info entries that now have a real Firestore home
 * to their Settings field. "hours" has no Settings field (out of scope
 * for Sprint 5.0 — not requested) and keeps its original static
 * "Coming soon" treatment unchanged.
 */
const SETTINGS_VALUE_FIELD: Partial<Record<string, keyof SettingsDoc>> = {
  location: "officeLocation",
  email: "contactEmail",
  phone: "contactPhone",
};

/**
 * Contact section (components/sections). Composes:
 *  - Office information (location/hours/email — "Coming soon" where not
 *    yet confirmed, per contact.ts's documented decision not to invent
 *    official details)
 *  - President contact — reuses LeaderCard (Sprint 1.5) and the
 *    `president` data from union.ts directly, rather than duplicating
 *    that data or building a new leader-display component
 *  - Official communication channels (Microsoft Teams for advisors)
 *
 * Sprint 5.0: office location and email now read from Settings
 * (settingsService) where set; "Coming soon" still shows exactly as
 * before whenever the admin hasn't filled them in yet — no content is
 * invented, just relocated to an editable source. "hours" is
 * unaffected. President contact and communication channels are
 * unchanged from before this sprint.
 *
 * Sprint 6.1: added a fourth office-info card, "phone", reading
 * Settings' contactPhone the same way — same "Coming soon" fallback,
 * same non-invented-content principle. The grid widened from 3 to 4
 * columns at the lg breakpoint to fit it.
 *
 * Official social media links are handled separately by
 * SocialLinksSection, reusing unionSocialLinks so nothing is repeated
 * on this same page.
 */
export function ContactSection() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("contact.heading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("contact.subheading")}
          </p>
        </div>

        {/* Office information */}
        <div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {translate("contact.officeHeading")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/70">
              {translate("contact.officeSubheading")}
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {officeInfo.map((item) => {
              const settingsField = SETTINGS_VALUE_FIELD[item.id];
              const settingsValue = settingsField
                ? (settings?.[settingsField] as string | undefined)
                : undefined;
              const description =
                settingsValue || (item.valueKey ? translate(item.valueKey) : translate("common.comingSoon"));

              return (
                <ContactCard
                  key={item.id}
                  icon={item.icon}
                  title={translate(item.labelKey)}
                  description={description}
                />
              );
            })}
          </div>
        </div>

        {/* President contact */}
        <div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {translate("contact.presidentHeading")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/70">
              {translate("contact.presidentSubheading")}
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-xs">
            <LeaderCard
              name={translate(president.nameKey)}
              position={translate(president.positionKey)}
              imageUrl={president.imagePath}
              imageAlt={translate(president.imageAltKey)}
              socialLinks={president.socialLinks}
            />
          </div>
        </div>

        {/* Official communication channels */}
        <div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {translate("contact.channelsHeading")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-foreground/70">
              {translate("contact.channelsSubheading")}
            </p>
          </div>

          <div className="mx-auto mt-6 grid max-w-xl gap-6 sm:grid-cols-1">
            {communicationChannels.map((channel) => (
              <ContactCard
                key={channel.id}
                icon={channel.icon}
                title={translate(channel.nameKey)}
                description={translate(channel.descriptionKey)}
                href={channel.href}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
