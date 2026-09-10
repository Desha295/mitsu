"use client";

import { MessageCircle, Users, Camera } from "lucide-react";
import { socialLinks } from "@/data/socialLinks";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";
import type { SettingsDoc } from "@/lib/firebase/collections";
import { cx, focusRing } from "@/lib/utils";

const iconMap = {
  MessageCircle,
  Users,
  Camera,
};

const SETTINGS_HREF_FIELD: Partial<
  Record<string, keyof SettingsDoc>
> = {
  whatsapp: "whatsappCommunityUrl",
  facebook: "facebookUrl",
  instagram: "instagramUrl",
};

export function FooterSocialLinks() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  const activeSocialLinks = socialLinks
    .map((link) => {
      const field = SETTINGS_HREF_FIELD[link.id];
      const value = field ? settings?.[field] : undefined;

      return {
        ...link,
        href:
          typeof value === "string" && value.trim().length > 0
            ? value.trim()
            : undefined,
      };
    })
    .filter(
      (link): link is typeof link & { href: string } =>
        Boolean(link.href)
    );

  if (activeSocialLinks.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {translate("footer.socialHeading")}
      </h3>

      <ul className="mt-3 flex items-center gap-3">
        {activeSocialLinks.map((link) => {
          const Icon = iconMap[link.icon];
          const label = translate(link.labelKey);

          return (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors duration-150 hover:bg-surface-muted hover:text-foreground",
                  focusRing
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
