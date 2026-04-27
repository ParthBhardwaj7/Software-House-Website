"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { TurnstileWidgetHandle } from "@/lib/turnstile-ref";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMemberAvatar } from "@/components/team/TeamMemberAvatar";
import { TurnstileField } from "@/components/security/TurnstileField";
import { cn } from "@/lib/utils";
import type { TeamMemberPublic } from "@/lib/team-types";

const HAS_TURNSTILE = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());

const SERVICES = [
  { id: "web_design", label: "Web Design" },
  { id: "app_software", label: "App / Custom Software" },
  { id: "seo_copy", label: "SEO / Copywriting" },
] as const;

type ContactFormProps = {
  variant?: "default" | "stacked";
  teamMembers: TeamMemberPublic[];
};

export function ContactForm({ variant = "default", teamMembers }: ContactFormProps) {
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterest: "" as (typeof SERVICES)[number]["id"] | "",
    message: "",
    consent: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isStacked = variant === "stacked";

  function validate(): boolean {
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email";
    if (!form.phone.trim()) err.phone = "Phone is required";
    if (!form.serviceInterest) err.serviceInterest = "Select what you need";
    if (!form.message.trim()) err.message = "Message is required";
    else if (form.message.trim().length < 10) err.message = "Please write at least 10 characters";
    if (!form.consent) err.consent = "You must agree to the terms";
    if (HAS_TURNSTILE && !turnstileToken?.trim()) {
      err.turnstile = "Complete the security check below";
    }

    setFieldErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setTouched({
      name: true,
      email: true,
      phone: true,
      serviceInterest: true,
      message: true,
      consent: true,
      turnstile: true,
    });
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch("/submit/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          serviceInterest: form.serviceInterest,
          consentAccepted: true,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { message?: string }).message || "Failed to send");
      }
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        serviceInterest: "",
        message: "",
        consent: false,
      });
      setTouched({});
      setFieldErrors({});
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const inputBase =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30";

  const strip = teamMembers.slice(0, 12);

  return (
    <section
      className={cn(
        "relative w-full",
        isStacked
          ? "flex min-h-0 w-full flex-col justify-center bg-transparent py-0"
          : "bg-gradient-to-b from-muted/30 via-background to-muted/20 py-16 md:py-24"
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          isStacked ? "" : "container max-w-7xl px-5 sm:px-6 lg:px-8"
        )}
      >
        <div
          className={cn(
            "grid items-start lg:grid-cols-2 lg:items-center",
            isStacked ? "gap-8 lg:gap-12" : "gap-12 lg:gap-16"
          )}
        >
          {/* Left: copy + avatars + CTA — vertically centered vs form on lg */}
          <div className="order-2 lg:order-1">
            <h2 className="font-display text-3xl font-normal tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Your project, our challenge!
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Ready to work together and move to the next level? Write to us if you want to meet us,
              start a collaboration, or say hello. We&apos;ll get back to you quickly.
            </p>

            {strip.length > 0 && (
              <div className="mt-8 overflow-visible pt-1 pb-7">
                <div className="flex flex-wrap items-end pl-1">
                  {strip.map((m, i) => (
                    <div
                      key={m.id}
                      className={cn(
                        "-ml-3 first:ml-0",
                        "[motion-reduce:hover]:transform-none"
                      )}
                      style={{ zIndex: strip.length - i }}
                    >
                      <TeamMemberAvatar
                        name={m.name}
                        photoUrl={m.photoUrl}
                        size="sm"
                        priority={i < 2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button asChild size="lg" className="rounded-xl px-8 font-semibold">
                <Link href="/team">See the whole team</Link>
              </Button>
            </div>
          </div>

          {/* Right: card + form (site palette) */}
          <div className="order-1 lg:order-2">
            <div
              className={cn(
                "rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5 sm:p-8",
                isStacked ? "" : "lg:sticky lg:top-24"
              )}
            >
              <h3 className="text-xl font-bold text-foreground md:text-2xl">Tell us what you need</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We are here for you, regardless of the size of the challenge.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate
                suppressHydrationWarning
              >
                {status === "success" && (
                  <p
                    className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
                    role="status"
                  >
                    Message sent successfully. We&apos;ll be in touch soon.
                  </p>
                )}
                {formError && (
                  <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {formError}
                  </p>
                )}

                <div>
                  <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className={cn("mt-1.5", inputBase)}
                    suppressHydrationWarning
                  />
                  {touched.name && fieldErrors.name && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                      E-mail *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      className={cn("mt-1.5", inputBase)}
                      suppressHydrationWarning
                    />
                    {touched.email && fieldErrors.email && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-sm font-medium text-foreground">
                      Phone *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      className={cn("mt-1.5", inputBase)}
                      suppressHydrationWarning
                    />
                    {touched.phone && fieldErrors.phone && (
                      <p className="mt-1 text-xs text-destructive">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">I need *</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SERVICES.map((s) => {
                      const selected = form.serviceInterest === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, serviceInterest: s.id }));
                            setTouched((t) => ({ ...t, serviceInterest: true }));
                          }}
                          suppressHydrationWarning
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            selected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-muted/60 text-foreground hover:border-primary/40 hover:bg-muted"
                          )}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                  {touched.serviceInterest && fieldErrors.serviceInterest && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.serviceInterest}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                    placeholder="Tell us about your goals, timeline, and budget…"
                    className={cn("mt-1.5 resize-none", inputBase)}
                    suppressHydrationWarning
                  />
                  {touched.message && fieldErrors.message && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.message}</p>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, consent: e.target.checked }));
                      setTouched((t) => ({ ...t, consent: true }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    suppressHydrationWarning
                  />
                  <span>I agree to the terms and conditions.</span>
                </label>
                {touched.consent && fieldErrors.consent && (
                  <p className="text-xs text-destructive">{fieldErrors.consent}</p>
                )}

                {HAS_TURNSTILE ? (
                  <div className="space-y-2">
                    <TurnstileField ref={turnstileRef} onToken={setTurnstileToken} />
                    {touched.turnstile && fieldErrors.turnstile ? (
                      <p className="text-xs text-destructive">{fieldErrors.turnstile}</p>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  aria-busy={status === "loading"}
                  className="w-full rounded-xl py-6 text-base font-semibold"
                  suppressHydrationWarning
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
