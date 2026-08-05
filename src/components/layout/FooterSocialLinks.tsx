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

/**
 * Maps each static placeholder entry's id (data/socialLinks.ts) to the
 * live Settings field that now supplies its href — the only thing that
 * changes; icon/label metadata stays exactly as that file already
 * defined it, so it isn't duplicated here.
 */
const SETTINGS_HREF_FIELD: Partial<Record<string, keyof SettingsDoc>> = {
  whatsapp: "whatsappCommunityUrl",
  facebook: "facebookUrl",
  instagram: "instagramUrl",
};

/**
 * Social links display (components/layout).
 *
 * Sprint 5.0: hrefs now come live from Settings via settingsService
 * instead of the permanently-empty placeholders in data/socialLinks.ts
 * (that file's own comment already anticipated this: "Once Firebase
 * content is available... this can be enhanced to render real links").
 * Icon/label metadata is still sourced from that file — unchanged.
 * Rendering is identical to before: a real link once Settings has an
 * href for that platform, a disabled button otherwise. The "Coming
 * soon" caption only shows while every link is still a placeholder.
 */
export function FooterSocialLinks() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  const hrefFor = (id: string): string | undefined => {
    const field = SETTINGS_HREF_FIELD[id];
    return field ? (settings?.[field] as string | undefined) : undefined;
  };
  const anyLinkActive = socialLinks.some((link) => Boolean(hrefFor(link.id)));

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {translate("footer.socialHeading")}
      </h3>
      <ul className="mt-3 flex items-center gap-3">
        {socialLinks.map((link) => {
          const Icon = iconMap[link.icon];
          const label = translate(link.labelKey);
          const href = hrefFor(link.id);
          return (
            <li key={link.id}>
              {href ? (
                <a
                  href={href}
                  aria-label={label}
                  className={cx(
                    "inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors duration-150 hover:text-foreground hover:bg-surface-muted",
                    focusRing
                  )}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/40 cursor-not-allowed"
                >
                  <Icon className="h-5 w-5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {!anyLinkActive && (
        <p className="mt-2 text-xs text-foreground/50">
          {translate("common.comingSoon")}
        </p>
      )}
    </div>
  );
}
