"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";

/**
 * Campus section (components/sections — Sprint 6.1 — Public Branding
 * Integration). A new, minimal, reusable section for Settings'
 * `campusImageUrl` — no existing public section had a slot for this
 * (Hero has its own, unrelated `imageUrl` from the `hero` collection),
 * so this is additive, not a redesign of anything existing.
 *
 * Also displays `universityLogoUrl` alongside the campus photo where
 * set (the most natural co-located spot for "university branding" —
 * Sprint 5.0 deliberately didn't force a separate, unrelated slot for
 * it elsewhere), and uses `universityName` as descriptive text/alt,
 * consistent with using Settings values wherever genuinely applicable.
 *
 * Graceful fallback: renders nothing at all when campusImageUrl is
 * unset, rather than showing an empty or broken-looking section —
 * matches how other optional, Settings-gated content behaves elsewhere
 * in this project. `unoptimized` is used for the same reason as
 * Logo.tsx: these are plain admin-entered URLs, not guaranteed Storage
 * uploads, so they could be any domain.
 */
export function CampusSection() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  if (!settings?.campusImageUrl) {
    return null;
  }

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        {settings.universityLogoUrl && (
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm">
            <Image
              src={settings.universityLogoUrl}
              alt={settings.universityName || translate("home.campus.universityLogoAlt")}
              fill
              unoptimized
              className="object-contain"
            />
          </span>
        )}

        <div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {translate("home.campus.heading")}
          </h2>
          {settings.universityName && (
            <p className="mt-2 text-foreground/70">{settings.universityName}</p>
          )}
        </div>

        <div className="relative aspect-[2/1] w-full max-w-4xl overflow-hidden rounded-lg border border-border shadow-sm">
          <Image
            src={settings.campusImageUrl}
            alt={
              settings.universityName
                ? settings.universityName
                : translate("home.campus.imageAlt")
            }
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>
      </Container>
    </section>
  );
}
