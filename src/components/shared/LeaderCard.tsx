"use client";

import Image from "next/image";
import * as Icons from "lucide-react";
import type { UnionLeader } from "@/data/union";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface LeaderCardProps {
  leader: UnionLeader;
}

/**
 * Leadership card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4). Receives a single UnionLeader via props;
 * all display text resolved through translate() — no hardcoded content.
 *
 * Renders the social links row only when the leader has any (the Vice
 * President currently has none) rather than showing an empty row.
 */
export function LeaderCard({ leader }: LeaderCardProps) {
  const { translate } = useLanguage();
  const hasSocialLinks = leader.socialLinks.length > 0;

  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-surface p-6 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border border-border bg-surface-muted sm:h-36 sm:w-36">
        <Image
          src={leader.imagePath}
          alt={translate(leader.imageAltKey)}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 128px, 144px"
        />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {translate(leader.nameKey)}
      </h3>
      <p className="mt-1 text-sm text-foreground/70">
        {translate(leader.positionKey)}
      </p>

      {hasSocialLinks && (
        <div className="mt-4 flex items-center gap-2">
          {leader.socialLinks.map((social) => {
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
      )}
    </div>
  );
}
