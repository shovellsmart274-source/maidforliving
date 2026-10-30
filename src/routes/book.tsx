import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, Info, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldLabel, fieldInput, NativeSelect, BATHROOM_OPTIONS, BEDROOM_OPTIONS, bathroomLabel, bedroomLabel } from "@/components/site/fields";
import { usePricing } from "@/hooks/use-public-data";
import { ADDONS, calculateEstimate, formatUSD, FREQUENCIES, HOME_SIZES, labelFor, TIME_SLOTS } from "@/lib/pricing";
import { createBooking } from "@/lib/public-data.functions";
import { SERVICES } from "@/lib/services-data";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  service: z.string().optional(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  zip: z.string().optional(),
  size: z.string().optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Book Your Cleaning Online | MaidForLiving" },
      { name: "description", content: "Book your house cleaning online in minutes. Choose your service, schedule and see your estimated price instantly." },
      { property: "og:title", content: "Book a Cleaning | MaidForLiving" },
      { property: "og:description", content: "Simple online booking with instant pricing." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/book" }],
  }),
  component: BookPage,
});

const STEPS = ["Service", "Rooms", "Property", "Frequency", "Schedule", "Details", "Summary", "Confirm"];

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { services, pricing } = usePricing();
  const book = useServerFn(createBooking);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [f, setF] = useState({
    serviceSlug: services.some((s) => s.slug === search.service) ? search.service! : "",
    bedrooms: search.bedrooms ?? 2,
    bathrooms: search.bathrooms ?? 1,
    zipCode: search.zip ?? "",
    homeSize: search.size?.startsWith("size_") ? search.size : "size_1000_1999",
    frequency: "freq_one_time",
    addons: [] as string[],
    preferredDate: "",
    preferredTime: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    specialInstructions: "",
  });
  const up = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const svc = services.find((s) => s.slug === f.serviceSlug);
  const est = useMemo(
    () =>
      calculateEstimate(
        { basePrice: svc?.base_price ?? 0, bedrooms: f.bedrooms, bathrooms: f.bathrooms, homeSize: f.homeSize, frequency: f.frequency, addons: f.addons },
        pricing,
      ),
    [svc, f, pricing],
  );

  function validate(s: number): string | null {
    if (s === 0 && !f.serviceSlug) return "Please select a cleaning service.";
    if (s === 2 && !/^\d{5}$/.test(f.zipCode)) return "Please enter a valid 5-digit ZIP code.";
    if (s === 4) {
      if (!f.preferredDate || f.preferredDate < tomorrow()) return "Please choose a date from tomorrow onward.";
      if (!f.preferredTime) return "Please choose a time window.";
    }
    if (s === 5) {
      if (f.fullName.trim().length < 2) return "Please enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return "Please enter a valid email.";
      if (f.phone.replace(/\D/g, "").length < 7) return "Please enter a valid phone number.";
      if (f.address.trim().length < 5) return "Please enter your complete address.";
    }
    return null;
  }

  function next() {
    const err = validate(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function confirm() {
    if (!agree) {
      toast.error("Please confirm the booking details.");
      return;
    }
    setLoading(true);
    try {
      const res = await book({ data: f });
      navigate({ to: "/booking-confirmation/$code", params: { code: res.code } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Booking failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="bg-gradient-soft py-12 sm:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Online booking</span>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Book Your Cleaning</h1>
          <p className="mt-3 text-muted-foreground">A few quick steps and your spotless home is scheduled.</p>
        </div>

        <ol className="mx-auto mt-10 flex max-w-4xl items-center justify-between gap-1 overflow-x-auto pb-2" aria-label="Booking progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 flex-col items-center gap-2 min-w-[56px]">
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-bold transition-all",
                  i < step && "border-primary bg-primary text-primary-foreground",
                  i === step && "border-primary bg-background text-primary shadow-elegant",
                  i > step && "border-border bg-background text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-[11px] font-semibold", i === step ? "text-primary" : "text-muted-foreground")}>{label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-9">
            <h2 className="text-xl font-bold sm:text-2xl">
              Step {step + 1}: {stepTitle(step)}
            </h2>
            <div className="mt-6">
              {step === 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => {
                    const img = SERVICES.find((x) => x.slug === s.slug)?.image;
                    const on = f.serviceSlug === s.slug;
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => up("serviceSlug", s.slug)}
                        className={cn("flex items-center gap-3 rounded-2xl border p-3 text-left transition-all", on ? "border-primary bg-accent ring-2 ring-primary/20" : "hover:border-primary/40")}
                      >
                        {img && <img src={img} alt="" className="h-14 w-14 rounded-xl object-cover" loading="lazy" />}
                        <span className="flex-1">
                          <span className="block text-sm font-bold">{s.name}</span>
                          <span className="text-xs text-muted-foreground">From {formatUSD(s.base_price)}</span>
                        </span>
                        {on && <Check className="h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="b-bed">Bedrooms</FieldLabel>
                    <NativeSelect id="b-bed" value={f.bedrooms} onChange={(e) => up("bedrooms", Number(e.target.value))}>
                      {BEDROOM_OPTIONS.map((n) => <option key={n} value={n}>{bedroomLabel(n)}</option>)}
                    </NativeSelect>
                  </div>
                  <div>
                    <FieldLabel htmlFor="b-bath">Bathrooms</FieldLabel>
                    <NativeSelect id="b-bath" value={f.bathrooms} onChange={(e) => up("bathrooms", Number(e.target.value))}>
                      {BATHROOM_OPTIONS.map((n) => <option key={n} value={n}>{bathroomLabel(n)}</option>)}
                    </NativeSelect>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="b-zip">ZIP Code</FieldLabel>
                    <input id="b-zip" inputMode="numeric" maxLength={5} value={f.zipCode} onChange={(e) => up("zipCode", e.target.value.replace(/\D/g, ""))} className={fieldInput} placeholder="e.g. 10001" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="b-size">Property Size</FieldLabel>
                    <NativeSelect id="b-size" value={f.homeSize} onChange={(e) => up("homeSize", e.target.value)}>
                      {HOME_SIZES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </NativeSelect>
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel>Additional services (optional)</FieldLabel>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {ADDONS.map((a) => {
                        const on = f.addons.includes(a.key);
                        return (
                          <button
                            key={a.key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => up("addons", on ? f.addons.filter((x) => x !== a.key) : [...f.addons, a.key])}
                            className={cn("flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all", on ? "border-primary bg-accent" : "hover:border-primary/40")}
                          >
                            <span className="flex items-center gap-2 font-semibold">
                              <span className={cn("grid h-5 w-5 place-items-center rounded-md border", on && "border-primary bg-primary text-primary-foreground")}>{on && <Check className="h-3.5 w-3.5" />}</span>
                              {a.label}
                            </span>
                            <span className="text-muted-foreground">+{formatUSD(pricing[a.key] ?? 0)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {FREQUENCIES.map((fr) => {
                    const pct = pricing[fr.key] ?? 0;
                    const on = f.frequency === fr.key;
                    return (
                      <button key={fr.key} type="button" onClick={() => up("frequency", fr.key)} className={cn("rounded-2xl border p-5 text-left transition-all", on ? "border-primary bg-accent ring-2 ring-primary/20" : "hover:border-primary/40")}>
                        <span className="flex items-center justify-between font-bold">
                          {fr.label} {on && <Check className="h-5 w-5 text-primary" />}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">{pct > 0 ? `Save ${pct}% on every visit` : "Single visit, no commitment"}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-5">
                  <div className="max-w-xs">
                    <FieldLabel htmlFor="b-date">Preferred Date</FieldLabel>
                    <input id="b-date" type="date" min={tomorrow()} value={f.preferredDate} onChange={(e) => up("preferredDate", e.target.value)} className={fieldInput} />
                  </div>
                  <div>
                    <FieldLabel>Preferred Time</FieldLabel>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {TIME_SLOTS.map((t) => (
                        <button key={t} type="button" onClick={() => up("preferredTime", t)} className={cn("rounded-2xl border px-3 py-3 text-sm font-semibold transition-all", f.preferredTime === t ? "border-primary bg-accent text-primary" : "hover:border-primary/40")}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="b-name">Full Name</FieldLabel>
                    <input id="b-name" autoComplete="name" value={f.fullName} onChange={(e) => up("fullName", e.target.value)} className={fieldInput} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="b-email">Email</FieldLabel>
                    <input id="b-email" type="email" autoComplete="email" value={f.email} onChange={(e) => up("email", e.target.value)} className={fieldInput} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="b-phone">Phone Number</FieldLabel>
                    <input id="b-phone" type="tel" autoComplete="tel" value={f.phone} onChange={(e) => up("phone", e.target.value)} className={fieldInput} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="b-addr">Complete Address</FieldLabel>
                    <input id="b-addr" autoComplete="street-address" value={f.address} onChange={(e) => up("address", e.target.value)} className={fieldInput} placeholder="Street, apt, city, state" />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="b-notes">Special Instructions</FieldLabel>
                    <textarea id="b-notes" rows={4} value={f.specialInstructions} onChange={(e) => up("specialInstructions", e.target.value)} className={`${fieldInput} h-auto py-3`} placeholder="Entry instructions, pets, areas to focus on…" />
                  </div>
                </div>
              )}

              {(step === 6 || step === 7) && (
                <div className="space-y-5">
                  <dl className="grid gap-x-6 gap-y-3 rounded-2xl bg-muted p-5 text-sm sm:grid-cols-2">
                    <SumRow k="Service" v={svc?.name ?? "—"} />
                    <SumRow k="Rooms" v={`${bedroomLabel(f.bedrooms)}, ${bathroomLabel(f.bathrooms)}`} />
                    <SumRow k="ZIP Code" v={f.zipCode} />
                    <SumRow k="Property size" v={labelFor(HOME_SIZES, f.homeSize)} />
                    <SumRow k="Frequency" v={labelFor(FREQUENCIES, f.frequency)} />
                    <SumRow k="Add-ons" v={f.addons.length ? f.addons.map((a) => labelFor(ADDONS, a)).join(", ") : "None"} />
                    <SumRow k="Date" v={f.preferredDate} />
                    <SumRow k="Time" v={f.preferredTime} />
                    <SumRow k="Name" v={f.fullName} />
                    <SumRow k="Email" v={f.email} />
                    <SumRow k="Phone" v={f.phone} />
                    <SumRow k="Address" v={f.address} />
                  </dl>
                  {f.specialInstructions && <p className="rounded-2xl border p-4 text-sm"><span className="font-semibold">Notes:</span> {f.specialInstructions}</p>}
                  {step === 7 && (
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-primary/30 bg-accent p-4 text-sm">
                      <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-5 w-5 accent-primary" />
                      <span>I confirm these details are correct and understand the price is an estimate that MaidForLiving will confirm before my cleaning.</span>
                    </label>
                  )}
                  {step === 6 && (
                    <div className="flex flex-wrap gap-2">
                      {[0, 1, 2, 3, 4, 5].map((s) => (
                        <Button key={s} variant="outline" size="sm" onClick={() => setStep(s)}>
                          Edit {STEPS[s]}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || loading}>
                <ArrowLeft /> Back
              </Button>
              {step < 7 ? (
                <Button variant="hero" size="lg" onClick={next}>
                  {step === 6 ? "Continue to Confirm" : "Continue"} <ArrowRight />
                </Button>
              ) : (
                <Button variant="hero" size="lg" onClick={confirm} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />} CONFIRM BOOKING
                </Button>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-ink p-7 text-ink-foreground shadow-card lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-wider text-fresh">Estimated price</p>
            <p className="mt-1 font-display text-5xl font-bold">{formatUSD(est.total)}</p>
            <p className="text-sm text-ink-foreground/70">{svc?.name ?? "Select a service"}</p>
            <dl className="mt-5 space-y-2 border-t border-ink-foreground/15 pt-4 text-sm">
              <PriceRow k="Base" v={formatUSD(est.base)} />
              <PriceRow k="Rooms" v={formatUSD(est.rooms)} />
              <PriceRow k="Size" v={formatUSD(est.size)} />
              <PriceRow k="Add-ons" v={formatUSD(est.addons)} />
              {est.discount > 0 && <PriceRow k={`Discount (${est.discountPct}%)`} v={`−${formatUSD(est.discount)}`} />}
            </dl>
            <p className="mt-5 flex gap-2 text-xs text-ink-foreground/60">
              <Info className="h-4 w-4 shrink-0" /> Estimates may require final confirmation.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function stepTitle(s: number) {
  return [
    "Select Cleaning Service",
    "Bedrooms & Bathrooms",
    "ZIP Code & Property Size",
    "Cleaning Frequency",
    "Preferred Date & Time",
    "Your Details",
    "Booking Summary",
    "Confirm Booking",
  ][s];
}

function SumRow({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 font-semibold">{v || "—"}</dd>
    </div>
  );
}
function PriceRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-foreground/70">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
