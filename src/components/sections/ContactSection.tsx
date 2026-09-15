"use client";

import * as Icons from "lucide-react";
import {
  ArrowUpRight,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  UsersRound,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaMicrosoft,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/sections/ContactForm";
import { officeInfo } from "@/data/contact";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import {
  settingsService,
  socialLinksService,
} from "@/lib/firebase/services";
import type {
  SettingsDoc,
  SocialLinkDoc,
} from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

const SETTINGS_VALUE_FIELD: Partial<
  Record<string, keyof SettingsDoc>
> = {
  location: "officeLocation",
  email: "contactEmail",
  phone: "contactPhone",
};

const ACTIVE_SOCIAL_LINKS: QueryOptions<SocialLinkDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
};

const SOCIAL_ICON_MAP: Record<string, IconType> = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
  Whatsapp: FaWhatsapp,
  Teams: FaMicrosoft,
  Microsoft: FaMicrosoft,
  MicrosoftTeams: FaMicrosoft,
};

function getSocialIcon(iconName: string): IconType {
  const brandIcon = SOCIAL_ICON_MAP[iconName];

  if (brandIcon) {
    return brandIcon;
  }

  const LucideIcon = (
    Icons as unknown as Record<string, IconType>
  )[iconName];

  return LucideIcon ?? MessageCircle;
}

export function ContactSection() {
  const { translate, language } = useLanguage();
  const isArabic = language === "ar";

  const { data: settings } = useFirestoreDoc(settingsService);

  const {
    data: socialLinks,
    loading: socialLinksLoading,
    error: socialLinksError,
  } = useFirestoreList(
    socialLinksService,
    ACTIVE_SOCIAL_LINKS
  );

  const sortedSocialLinks = [...socialLinks].sort(
    (a, b) => a.order - b.order
  );

  const availableOfficeInfo = officeInfo.filter((item) => {
    const settingsField = SETTINGS_VALUE_FIELD[item.id];

    if (!settingsField) {
      return false;
    }

    const value = settings?.[settingsField];

    return (
      typeof value === "string" &&
      value.trim().length > 0
    );
  });

  const contactOptions = [
    {
      number: "01",
      icon: MessageCircle,
      title: isArabic
        ? "استفسار أكاديمي"
        : "Academic Support",
      description: isArabic
        ? "تحتاج مساعدة في التسجيل، المواد، أو الإرشاد الأكاديمي؟"
        : "Questions about registration, courses, or academic guidance?",
      action: isArabic
        ? "المرشدون الأكاديميون"
        : "Find your advisor",
      href: "/academic-advisors",
    },
    {
      number: "02",
      icon: MessageCircle,
      title: isArabic
        ? "أنظمة ومنصات الجامعة"
        : "University Systems",
      description: isArabic
        ? "ابحث عن النظام أو المنصة التي تحتاجها للوصول إلى خدمات الجامعة."
        : "Find the university system or platform you need.",
      action: isArabic
        ? "عرض الأنظمة"
        : "Explore systems",
      href: "/systems",
    },
    {
      number: "03",
      icon: UsersRound,
      title: isArabic
        ? "اتحاد الطلاب"
        : "Student Union",
      description: isArabic
        ? "للتواصل مع الاتحاد، الأنشطة الطلابية، والمبادرات."
        : "For student activities, initiatives, and union support.",
      action: isArabic
        ? "زيارة الاتحاد"
        : "Visit Student Union",
      href: "/union",
    },
    {
      number: "04",
      icon: MessageCircle,
      title: isArabic
        ? "استفسار عام"
        : "General Inquiry",
      description: isArabic
        ? "لم تجد ما تبحث عنه؟ تواصل معنا عبر القنوات الرسمية."
        : "Can't find what you need? Reach us through the official channels.",
      action: isArabic
        ? "قنوات التواصل"
        : "Official channels",
      href: "#channels",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -start-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -end-40 top-1/3 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black tracking-wide text-primary">
            <Sparkles
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {isArabic
              ? "تواصل مع MITSU"
              : "CONNECT WITH MITSU"}
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {translate("contact.heading")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
            {translate("contact.subheading")}
          </p>
        </div>

        <div className="mt-16">
          <div className="mb-8">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              {isArabic
                ? "كيف يمكننا مساعدتك؟"
                : "HOW CAN WE HELP?"}
            </span>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {isArabic
                  ? "اختار الجهة المناسبة لاستفسارك"
                  : "Find the right place for your question"}
              </h2>

              <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-end">
                {isArabic
                  ? "اختار الموضوع الأقرب لطلبك وسنوصلك مباشرة بالمكان المناسب."
                  : "Choose the option closest to your question and we'll take you there."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {contactOptions.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.number}
                  href={item.href}
                  className="group relative min-h-[220px] overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
                >
                  <span className="absolute end-6 top-5 text-6xl font-black leading-none text-foreground/[0.035]">
                    {item.number}
                  </span>

                  <div
                    aria-hidden="true"
                    className="absolute -end-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-105">
                        <Icon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </div>

                      <ArrowUpRight
                        className="h-5 w-5 text-muted-foreground/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary rtl:rotate-[-90deg]"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="mt-auto pt-10">
                      <h3 className="text-xl font-black tracking-tight text-foreground">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                        {item.action}

                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <ContactForm />

        <div
          id="channels"
          className="mt-16 scroll-mt-28"
        >
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                {isArabic
                  ? "ابقَ على تواصل"
                  : "STAY CONNECTED"}
              </span>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {translate("union.socialHeading")}
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-end">
              {translate("union.socialSubheading")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinksLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {translate("common.loading")}
              </div>
            ) : socialLinksError ? (
              <p className="text-sm text-muted-foreground">
                {isArabic
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
                    className="group inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/80 px-4 py-3 text-sm font-bold text-foreground shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary">
                      <IconComponent
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </span>

                    {label}

                    <ArrowUpRight
                      className="h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </a>
                );
              })
            )}
          </div>
        </div>

        {availableOfficeInfo.length > 0 && (
          <div className="mt-16">
            <div className="mb-7">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                {isArabic ? "" : " "}
              </span>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {translate("contact.officeHeading")}
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableOfficeInfo.map((item) => {
                const settingsField =
                  SETTINGS_VALUE_FIELD[item.id];

                if (!settingsField) {
                  return null;
                }

                const value = settings?.[settingsField];

                if (
                  typeof value !== "string" ||
                  !value.trim()
                ) {
                  return null;
                }

                const Icon =
                  item.id === "location"
                    ? MapPin
                    : item.id === "email"
                      ? Mail
                      : item.id === "phone"
                        ? Phone
                        : Clock;

                const isEmail = item.id === "email";

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-border/70 bg-surface/75 p-5 backdrop-blur-xl"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary">
                      <Icon
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-muted-foreground">
                        {translate(item.labelKey)}
                      </p>

                      {isEmail ? (
                        <a
                          href={`mailto:${value}`}
                          className="mt-1 block break-words text-sm font-bold text-primary underline-offset-4 transition-colors hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 break-words text-sm font-bold text-foreground">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
