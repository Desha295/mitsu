"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

/**
 * Login section (components/sections). Real, working authentication —
 * calls `loginWithEmail`/`loginWithGoogle` from `useAuth()` (Sprint 2.4),
 * not a placeholder form. No registration or password-reset UI, per
 * CURRENT_SPRINT.md's explicit "Out of Scope" list.
 */
export function LoginSection() {
  const { user, loading, loginWithEmail, loginWithGoogle } = useAuth();
  const { translate } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? There's no dashboard yet to send them to (Sprint
  // 2.4 explicitly excludes it), so redirect home rather than leaving
  // a signed-in user stuck on the login form.
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      router.replace("/");
    } catch {
      setError(translate("login.error.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace("/");
    } catch {
      setError(translate("login.error.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background py-12">
      <Container className="flex justify-center">
        <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <Logo showIdentity={false} />
            <h1 className="mt-4 text-xl font-bold text-foreground">
              {translate("login.heading")}
            </h1>
            <p className="mt-2 text-sm text-foreground/70">
              {translate("login.subheading")}
            </p>
          </div>

          <form
            onSubmit={handleEmailSubmit}
            className="mt-6 flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="login-email"
                className="text-sm font-medium text-foreground"
              >
                {translate("login.emailLabel")}
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={cx(
                  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                  focusRing
                )}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-foreground"
              >
                {translate("login.passwordLabel")}
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={cx(
                  "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                  focusRing
                )}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-primary">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={cx(
                "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark disabled:opacity-60",
                focusRing
              )}
            >
              {submitting
                ? translate("login.submitting")
                : translate("login.submit")}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="text-xs font-medium text-foreground/50">
              {translate("login.or")}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className={cx(
              "inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted disabled:opacity-60",
              focusRing
            )}
          >
            {translate("login.googleSignIn")}
          </button>
        </div>
      </Container>
    </section>
  );
}
