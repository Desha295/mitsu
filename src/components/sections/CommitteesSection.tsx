"use client";

import * as Icons from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaMicrosoft,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { Loader2, UsersRound, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { CommitteeCard } from "@/components/shared/CommitteeCard";
import { committees } from "@/data/union";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import {
  unionService,
  committeeMembersService,
  socialLinksService,
} from "@/lib/firebase/services";
import type {
  CommitteeDoc,
  CommitteeMemberDoc,
  SocialLinkDoc,
} from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { cx, focusRing } from "@/lib/utils";

const ACTIVE_COMMITTEES_ORDERED: QueryOptions<CommitteeDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

const ALL_COMMITTEE_MEMBERS: QueryOptions<CommitteeMemberDoc> = {};

const ACTIVE_SOCIAL_LINKS: QueryOptions<SocialLinkDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
};

const STATIC_ICON_BY_ORDER: Record<number, string> =
  Object.fromEntries(
    committees.map((committee) => [
      committee.order,
      committee.icon,
    ])
  );

type SocialIcon = IconType;

const SOCIAL_ICON_MAP: Record<string, SocialIcon> = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
  Whatsapp: FaWhatsapp,
  Microsoft: FaMicrosoft,
  Teams: FaMicrosoft,
  MicrosoftTeams: FaMicrosoft,
};

function getSocialIcon(iconName: string): SocialIcon {
  const brandIcon = SOCIAL_ICON_MAP[iconName];

  if (brandIcon) {
    return brandIcon;
  }

  const LucideIcon = (
    Icons as unknown as Record<string, SocialIcon>
  )[iconName];

  return LucideIcon ?? MessageCircleFallback;
}

function MessageCircleFallback({
  className,
}: {
  className?: string;
}) {
  return (
    <Icons.MessageCircle
      className={className}
      aria-hidden="true"
    />
  );
}

export function CommitteesSection() {
  const { translate, language } = useLanguage();

  const {
    data: sortedCommittees,
    loading: committeesLoading,
    error: committeesError,
  } = useFirestoreList(
    unionService,
    ACTIVE_COMMITTEES_ORDERED
  );

  const {
    data: committeeMembers,
    loading: membersLoading,
    error: membersError,
  } = useFirestoreList(
    committeeMembersService,
    ALL_COMMITTEE_MEMBERS
  );

  const {
    data: socialLinks,
    loading: socialLinksLoading,
    error: socialLinksError,
  } = useFirestoreList(
    socialLinksService,
    ACTIVE_SOCIAL_LINKS
  );

  const loading =
    committeesLoading ||
    membersLoading ||
    socialLinksLoading;

  const error =
    committeesError ||
    membersError ||
    socialLinksError;

  const sortedSocialLinks = [...socialLinks].sort(
    (a, b) => a.order - b.order
  );

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <UsersRound
              className="h-4 w-4"
              aria-hidden="true"
            />

            <span>
              {translate("union.committeesHeading")}
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {translate("union.committeesHeading")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {translate("union.committeesSubheading")}
          </p>
        </div>

        {loading ? (
          <div
            role="status"
            className="flex min-h-[20rem] flex-col items-center justify-center gap-4 rounded-3xl border border-border/70 bg-surface/70"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
              <Loader2
                className="h-7 w-7 animate-spin text-primary"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {translate("common.loading")}
            </p>
          </div>
        ) : null}

        {!loading && error ? (
          <div
            role="alert"
            className="flex min-h-[20rem] flex-col items-center justify-center rounded-3xl border border-border/70 bg-surface/70 px-6 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("union.committeesErrorState")}
            </p>
          </div>
        ) : null}

        {!loading && !error ? (
          sortedCommittees.length > 0 ? (
            <div className="mx-auto flex w-full max-w-7xl flex-wrap justify-center gap-6">
              {sortedCommittees.map((committee) => {
                const name =
                  language === "ar"
                    ? committee.nameAr
                    : committee.nameEn;

                const description =
                  language === "ar"
                    ? committee.descriptionAr
                    : committee.descriptionEn;

                const members = committeeMembers
                  .filter(
                    (member) =>
                      member.committeeId === committee.id
                  )
                  .sort(
                    (a, b) => a.order - b.order
                  );

                return (
                  <div
                    key={committee.id}
                    className="group relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -inset-1 rounded-[2rem] bg-primary/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div className="relative h-full overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-1.5 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/25 group-hover:shadow-xl group-hover:shadow-primary/5">
                      <CommitteeCard
                        name={name}
                        description={description}
                        icon={
                          STATIC_ICON_BY_ORDER[
                            committee.order
                          ]
                        }
                        members={members}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
              <UsersRound
                className="mx-auto mb-3 h-7 w-7 text-muted-foreground"
                aria-hidden="true"
              />

              <p className="text-sm text-muted-foreground">
                {translate(
                  "union.committeesEmptyState"
                )}
              </p>
            </div>
          )
        ) : null}

        <div className="mx-auto mt-20 w-full max-w-5xl border-t border-border/70 pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 p-3 text-primary">
              <ArrowUpRight
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {translate("union.socialHeading")}
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              {translate("union.socialSubheading")}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {socialLinksLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                {translate("common.loading")}
              </div>
            ) : socialLinksError ? (
              <p className="text-sm text-muted-foreground">
                {language === "ar"
                  ? "تعذر تحميل قنوات التواصل."
                  : "Unable to load communication channels."}
              </p>
            ) : (
              sortedSocialLinks.map((social) => {
                const IconComponent =
                  getSocialIcon(social.icon);

                const label =
                  language === "ar"
                    ? social.nameAr
                    : social.nameEn;

                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(
                      [
                        "group inline-flex min-h-11 items-center gap-2",
                        "rounded-xl border border-border/70",
                        "bg-surface/80 px-4 py-2.5",
                        "text-sm font-semibold text-foreground",
                        "shadow-sm backdrop-blur-xl",
                        "transition-all duration-200",
                        "hover:-translate-y-0.5",
                        "hover:border-primary/25",
                        "hover:bg-primary/5",
                        "hover:text-primary",
                        "hover:shadow-md",
                      ].join(" "),
                      focusRing
                    )}
                  >
                    <IconComponent
                      className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                      aria-hidden="true"
                    />

                    <span>{label}</span>

                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                );
              })
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}