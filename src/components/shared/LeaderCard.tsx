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

export function LeaderCard({
  name,
  position,
  imageAlt,
  imageUrl,
  socialLinks = [],
}: LeaderCardProps) {
  const hasSocialLinks = socialLinks.length > 0;

  return (
    <article className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-border/70 bg-surface/80 px-6 py-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg sm:px-8">
      {/* Subtle accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary/70 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Portrait */}
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-primary/5 transition-all duration-300 group-hover:bg-primary/10" />

        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-surface-muted shadow-md sm:h-36 sm:w-36">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 128px, 144px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-foreground/35">
              <ImageOff
                className="h-9 w-9"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-1 flex-col items-center">
        <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground">
          {name}
        </h3>

        <div className="mt-3 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5">
          <p className="text-sm font-medium leading-5 text-primary">
            {position}
          </p>
        </div>
      </div>

      {/* Social Links */}
      {hasSocialLinks && (
        <SocialLinksRow socialLinks={socialLinks} />
      )}
    </article>
  );
}

function SocialLinksRow({
  socialLinks,
}: {
  socialLinks: SocialLinkItem[];
}) {
  const { translate } = useLanguage();

  return (
    <div className="mt-6 flex items-center justify-center gap-2 border-t border-border/60 pt-5">
      {socialLinks.map((social) => {
        const IconComponent = (
          Icons as unknown as Record<
            string,
            React.ComponentType<{ className?: string }>
          >
        )[social.icon];

        const label = translate(social.labelKey);

        if (!IconComponent) {
          return null;
        }

        return (
          <a
            key={social.labelKey}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cx(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-foreground/60 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
              focusRing
            )}
          >
            <IconComponent
              className="h-4 w-4"
              aria-hidden="true"
            />
          </a>
        );
      })}
    </div>
  );
}
