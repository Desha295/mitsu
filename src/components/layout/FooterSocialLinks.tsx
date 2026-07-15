"use client";

import { MessageCircle, Users, Camera } from "lucide-react";
import { socialLinks } from "@/data/socialLinks";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const iconMap = {
  MessageCircle,
  Users,
  Camera,
};

/**
 * Social links display (components/layout). Renders placeholder social
 * entries from data/socialLinks.ts. Since all links are placeholders (no
 * official href yet), they're displayed as disabled buttons. Once Firebase
 * content is available (Phase 4), this can be enhanced to render real links.
 */
export function FooterSocialLinks() {
  const { translate } = useLanguage();

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {translate("footer.socialHeading")}
      </h3>
      <ul className="mt-3 flex items-center gap-3">
        {socialLinks.map((link) => {
          const Icon = iconMap[link.icon];
          const label = translate(link.labelKey);
          return (
            <li key={link.id}>
              {link.href ? (
                <a
                  href={link.href}
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
      <p className="mt-2 text-xs text-foreground/50">
        {translate("common.comingSoon")}
      </p>
    </div>
  );
}
