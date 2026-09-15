"use client";

import { type FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const { translate } = useLanguage();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error ?? translate("contact.form.error"));

      setValues(INITIAL_VALUES);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : translate("contact.form.error"));
      setStatus("error");
    }
  };

  const sending = status === "sending";
  const fields: Array<{ field: "name" | "email" | "subject"; type?: "email" }> = [
    { field: "name" },
    { field: "email", type: "email" },
    { field: "subject" },
  ];

  return (
    <div className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div className="lg:pt-7">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">{translate("contact.form.eyebrow")}</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">{translate("contact.form.heading")}</h2>
        <p className="mt-4 max-w-lg text-base leading-8 text-muted-foreground">{translate("contact.form.description")}</p>
      </div>

      <form onSubmit={submit} className="rounded-[2rem] border border-border/70 bg-surface/80 p-6 shadow-sm backdrop-blur-xl sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.slice(0, 2).map(({ field, type }) => (
            <label key={field} className="block text-sm font-bold text-foreground">
              {translate(`contact.form.${field}`)}
              <input type={type ?? "text"} value={values[field]} onChange={(event) => update(field, event.target.value)} required maxLength={field === "name" ? 120 : 254} autoComplete={field === "name" ? "name" : "email"} dir={field === "email" ? "ltr" : undefined} placeholder={translate(`contact.form.${field}Placeholder`)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </label>
          ))}
        </div>
        <label className="mt-5 block text-sm font-bold text-foreground">
          {translate("contact.form.subject")}
          <input value={values.subject} onChange={(event) => update("subject", event.target.value)} required maxLength={180} placeholder={translate("contact.form.subjectPlaceholder")} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" />
        </label>
        <label className="mt-5 block text-sm font-bold text-foreground">
          {translate("contact.form.message")}
          <textarea value={values.message} onChange={(event) => update("message", event.target.value)} required maxLength={5000} rows={6} placeholder={translate("contact.form.messagePlaceholder")} className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" />
        </label>
        <label className="sr-only" aria-hidden="true">Website<input value={values.website} onChange={(event) => update("website", event.target.value)} tabIndex={-1} autoComplete="off" /></label>
        {status === "success" && <p role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-4 w-4 shrink-0" />{translate("contact.form.success")}</p>}
        {status === "error" && <p role="alert" className="mt-5 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{errorMessage}</p>}
        <button type="submit" disabled={sending} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-70">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:rotate-180" />}
          {sending ? translate("contact.form.sending") : translate("contact.form.submit")}
        </button>
      </form>
    </div>
  );
}
