"use client";

import * as Icons from "lucide-react";
import {
  ArrowRight,
  GraduationCap,
  HelpCircle,
  MapPin,
  MessageCircle,
  Monitor,
  Phone,
  Mail,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { officeInfo, communicationChannels } from "@/data/contact";
import { unionSocialLinks } from "@/data/union";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";
import type { SettingsDoc } from "@/lib/firebase/collections";

const SETTINGS_VALUE_FIELD: Partial<
  Record<string, keyof SettingsDoc>
> = {
  location: "officeLocation",
  email: "contactEmail",
  phone: "contactPhone",
};

export function ContactSection() {
  const { translate, language } = useLanguage();
  const isArabic = language === "ar";

  const { data: settings } = useFirestoreDoc(settingsService);

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

  const helpItems = [
    {
      icon: GraduationCap,
      title: isArabic
        ? "المرشد الأكاديمي"
        : "Academic Advisors",
      description: isArabic
        ? "للاستفسارات الأكاديمية والإرشاد الدراسي."
        : "For academic guidance and study-related support.",
      href: "/academic-advisors",
    },
    {
      icon: Monitor,
      title: isArabic
        ? "أنظمة الجامعة"
        : "University Systems",
      description: isArabic
        ? "للوصول إلى الأنظمة والمنصات الجامعية."
        : "Find the university systems and platforms you need.",
      href: "/systems",
    },
    {
      icon: UsersRound,
      title: isArabic
        ? "اتحاد الطلاب"
        : "Student Union",
      description: isArabic
        ? "لأنشطة الطلاب والمبادرات والتواصل مع الاتحاد."
        : "For student activities, initiatives, and union support.",
      href: "/union",
    },
    {
      icon: MessageCircle,
      title: isArabic
        ? "الاستفسارات العامة"
        : "General Inquiries",
      description: isArabic
        ? "لأي استفسار آخر يمكنك التواصل معنا مباشرة."
        : "For anything else, reach out through our official channels.",
      href: "#official-channels",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -start-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -end-40 top-1/3 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <Container className="relative flex flex-col gap-20">
        {/* Hero */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-black tracking-wide text-primary">
            <Sparkles
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {isArabic
              ? "تواصل مع MITSU"
              : "CONNECT WITH MITSU"}
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {translate("contact.heading")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
            {translate("contact.subheading")}
          </p>
        </div>

        {/* Official contact hub */}
        <section id="official-channels">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-surface/80 p-6 shadow-sm backdrop-blur-xl sm:p-9 md:p-10">
            <div
              aria-hidden="true"
              className="absolute -end-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative">
              <div className="max-w-2xl">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                  {isArabic
                    ? "القنوات الرسمية"
                    : "OFFICIAL CHANNELS"}
                </span>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {translate("contact.channelsHeading")}
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {translate("contact.channelsSubheading")}
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {communicationChannels.map((channel) => {
                  const IconComponent = (
                    Icons as unknown as Record<
                      string,
                      React.ComponentType<{
                        className?: string;
                      }>
                    >
                  )[channel.icon];

                  return (
                    <a
                      key={channel.id}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.04] hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-105">
                        {IconComponent ? (
                          <IconComponent
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-foreground">
                          {translate(channel.nameKey)}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {translate(channel.descriptionKey)}
                        </p>
                      </div>

                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Need help */}
        <section>
          <div className="mb-8 text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              {isArabic ? "ابدأ من هنا" : "START HERE"}
            </span>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {isArabic
                ? "محتاج مساعدة؟"
                : "Need help with something?"}
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {isArabic
                ? "اختار الموضوع الأقرب لاستفسارك وسنوصلك بالمكان المناسب."
                : "Choose what you need and we'll take you to the right place."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {helpItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface/75 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                >
                  <span className="absolute end-5 top-5 text-[10px] font-black tracking-widest text-muted-foreground/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <ArrowRight
                      className="h-4 w-4 text-muted-foreground/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-6 text-base font-black text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Office */}
        {availableOfficeInfo.length > 0 && (
          <section>
            <div className="mb-8 text-center">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                {isArabic
                  ? "معلومات التواصل"
                  : "CONTACT INFORMATION"}
              </span>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {translate("contact.officeHeading")}
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {translate("contact.officeSubheading")}
              </p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                      : Phone;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border/70 bg-surface/75 p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                        <Icon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-muted-foreground">
                          {translate(item.labelKey)}
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold text-foreground">
                          {value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Community */}
        {unionSocialLinks.length > 0 && (
          <section>
            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface-muted/70 p-7 text-center sm:p-10">
              <div
                aria-hidden="true"
                className="absolute start-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
              />

              <div className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
                  <MessageCircle
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-black text-foreground">
                  {translate("union.socialHeading")}
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                  {translate("union.socialSubheading")}
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  {unionSocialLinks.map((social) => {
                    const IconComponent = (
                      Icons as unknown as Record<
                        string,
                        React.ComponentType<{
                          className?: string;
                        }>
                      >
                    )[social.icon];

                    return (
                      <a
                        key={social.labelKey}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-all duration-200 hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
                      >
                        {IconComponent ? (
                          <IconComponent
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        ) : null}

                        {translate(social.labelKey)}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-primary/[0.045] px-6 py-10 text-center sm:px-10">
          <div
            aria-hidden="true"
            className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />

          <HelpCircle
            className="mx-auto h-7 w-7 text-primary"
            aria-hidden="true"
          />

          <h2 className="mt-4 text-xl font-black text-foreground sm:text-2xl">
            {isArabic
              ? "لسه مش عارف تبدأ منين؟"
              : "Still not sure where to start?"}
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {isArabic
              ? "تواصل معنا من خلال إحدى القنوات الرسمية وسنساعدك في الوصول للمكان المناسب."
              : "Reach out through one of our official channels and we'll help you find the right place."}
          </p>
        </div>
      </Container>
    </section>
  );
}
