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
 * Maps office-info entries that have a real Firestore home
 * to their corresponding Settings field.
 */
const SETTINGS_VALUE_FIELD: Partial<Record<string, keyof SettingsDoc>> = {
  location: "officeLocation",
  email: "contactEmail",
  phone: "contactPhone",
};

/**
 * Contact section (components/sections).
 *
 * Optional office information is rendered only when its value
 * exists in Settings. Empty or missing values are hidden entirely.
 *
 * President contact and official communication/social channels
 * remain unchanged and continue to use their existing static
 * sources of truth.
 */
export function ContactSection() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  const availableOfficeInfo = officeInfo.filter((item) => {
    const settingsField = SETTINGS_VALUE_FIELD[item.id];

    if (!settingsField) {
      return false;
    }

    const value = settings?.[settingsField];

    return typeof value === "string" && value.trim().length > 0;
  });

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
        {availableOfficeInfo.length > 0 && (
          <div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {translate("contact.officeHeading")}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-foreground/70">
                {translate("contact.officeSubheading")}
              </p>
            </div>

            <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-6">
              {availableOfficeInfo.map((item) => {
                const settingsField = SETTINGS_VALUE_FIELD[item.id];

                if (!settingsField) {
                  return null;
                }

                const settingsValue = settings?.[settingsField];

                if (
                  typeof settingsValue !== "string" ||
                  settingsValue.trim().length === 0
                ) {
                  return null;
                }

                return (
                  <div
                    key={item.id}
                    className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                  >
                    <ContactCard
                      icon={item.icon}
                      title={translate(item.labelKey)}
                      description={settingsValue}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

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