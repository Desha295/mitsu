"use client";

import Image from "next/image";
import * as Icons from "lucide-react";
import { ImageOff } from "lucide-react";
import type { SocialLinkItem } from "@/data/union";
import { cx, focusRing } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface LeaderCardProps {
  name: string;
  position: string;
  /** Resolved by the caller (translate() or Firestore content) — not resolved internally, so this component has no translation-key dependency. */
  imageAlt: string;
  imageUrl?: string;
  socialLinks?: SocialLinkItem[];
}

/**
 * Leadership card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4).
 *
 * Sprint 4 — Phase 4.7: props changed from a whole static `UnionLeader`
 * (translation-key based) object to resolved primitives, since this
 * component is shared by two callers with different data sources:
 * LeadershipSection (now Firestore-backed via leadershipService) and
 * ContactSection (still fully static, unchanged, out of scope for
 * Sprint 4). A single clean prop contract lets both callers resolve
 * their own content their own way, rather than this component assuming
 * either one.
 *
 * Renders the social links row only when there are any (the Vice
 * President currently has none) rather than showing an empty row.
 */
export function LeaderCard({
  name,
  position,
  imageAlt,
  imageUrl,
  socialLinks = [],
}: LeaderCardProps) {
  const hasSocialLinks = socialLinks.length > 0;

  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-surface p-6 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border bg-surface-muted sm:h-36 sm:w-36">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 128px, 144px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground/40">
            <ImageOff className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-foreground/70">{position}</p>

      {hasSocialLinks && (
        <SocialLinksRow socialLinks={socialLinks} />
      )}
    </div>
  );
}

/** Kept as a small inline helper (not a new shared file) since it's only
 * ever used here, right below, purely to keep LeaderCard's main return
 * readable — this still needs translate() for each link's label. */
function SocialLinksRow({ socialLinks }: { socialLinks: SocialLinkItem[] }) {
  const { translate } = useLanguage();

  return (
    <div className="mt-4 flex items-center gap-2">
      {socialLinks.map((social) => {
        const IconComponent = (
          Icons as unknown as Record<
            string,
            React.ComponentType<{ className?: string }>
          >
        )[social.icon];
        const label = translate(social.labelKey);

        return (
          <a
            key={social.labelKey}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cx(
              "inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors duration-150 hover:bg-surface-muted hover:text-foreground",
              focusRing
            )}
          >
            {IconComponent && (
              <IconComponent className="h-4 w-4" aria-hidden="true" />
            )}
          </a>
        );
      })}
    </div>
  );
}
