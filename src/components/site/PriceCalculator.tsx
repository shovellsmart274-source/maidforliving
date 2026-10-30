import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/use-public-data";
import { ADDONS, calculateEstimate, formatUSD, FREQUENCIES, HOME_SIZES } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { BATHROOM_OPTIONS, BEDROOM_OPTIONS, bathroomLabel, bedroomLabel, FieldLabel, NativeSelect } from "./fields";

export function PriceCalculator() {
  const { services, pricing } = usePricing();
  const [service, setService] = useState(services[0]?.slug ?? "standard-house-cleaning");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [homeSize, setHomeSize] = useState<string>("size_1000_1999");
  const [frequency, setFrequency] = useState<string>("freq_biweekly");
  const [addons, setAddons] = useState<string[]>([]);

  const est = useMemo(() => {
    const svc = services.find((s) => s.slug === service);
    return calculateEstimate(
      { basePrice: svc?.base_price ?? 0, bedrooms, bathrooms, homeSize, frequency, addons },
      pricing,
    );
  }, [services, service, bedrooms, bathrooms, homeSize, frequency, addons, pricing]);

  const toggle = (k: string) => setAddons((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="c-svc">Cleaning type</FieldLabel>
            <NativeSelect id="c-svc" value={service} onChange={(e) => setService(e.target.value)}>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <FieldLabel htmlFor="c-bed">Bedrooms</FieldLabel>
            <NativeSelect id="c-bed" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))}>
              {BEDROOM_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {bedroomLabel(n)}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <FieldLabel htmlFor="c-bath">Bathrooms</FieldLabel>
            <NativeSelect id="c-bath" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))}>
              {BATHROOM_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {bathroomLabel(n)}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="c-size">Property size</FieldLabel>
            <NativeSelect id="c-size" value={homeSize} onChange={(e) => setHomeSize(e.target.value)}>
              {HOME_SIZES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>

        <div className="mt-6">
          <FieldLabel>Frequency</FieldLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FREQUENCIES.map((f) => {
              const pct = pricing[f.key] ?? 0;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFrequency(f.key)}
                  className={cn(
                    "rounded-2xl border px-3 py-3 text-sm font-semibold transition-all",
                    frequency === f.key ? "border-primary bg-accent text-primary" : "hover:border-primary/40",
                  )}
                >
                  {f.label}
                  {pct > 0 && <span className="block text-xs font-medium text-fresh">Save {pct}%</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <FieldLabel>Additional services</FieldLabel>
          <div className="grid gap-2 sm:grid-cols-2">
            {ADDONS.map((a) => {
              const on = addons.includes(a.key);
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggle(a.key)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-all",
                    on ? "border-primary bg-accent" : "hover:border-primary/40",
                  )}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <span className={cn("grid h-5 w-5 place-items-center rounded-md border", on && "border-primary bg-primary text-primary-foreground")}>
                      {on && <Check className="h-3.5 w-3.5" />}
                    </span>
                    {a.label}
                  </span>
                  <span className="text-muted-foreground">+{formatUSD(pricing[a.key] ?? 0)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-3xl bg-ink p-7 text-ink-foreground shadow-card lg:sticky lg:top-28 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-fresh">Your estimate</p>
        <p className="mt-2 font-display text-6xl font-bold">{formatUSD(est.total)}</p>
        <p className="text-sm text-ink-foreground/70">per cleaning</p>
        <dl className="mt-6 space-y-2.5 border-t border-ink-foreground/15 pt-5 text-sm">
          <Row label="Base service" value={formatUSD(est.base)} />
          <Row label="Rooms" value={formatUSD(est.rooms)} />
          <Row label="Property size" value={formatUSD(est.size)} />
          <Row label="Add-ons" value={formatUSD(est.addons)} />
          {est.discount > 0 && <Row label={`Frequency discount (${est.discountPct}%)`} value={`−${formatUSD(est.discount)}`} highlight />}
        </dl>
        <Button asChild variant="hero" size="lg" className="mt-7 w-full">
          <Link to="/book" search={{ service, bedrooms, bathrooms, size: homeSize }}>
            BOOK THIS CLEANING
          </Link>
        </Button>
        <p className="mt-4 flex gap-2 text-xs text-ink-foreground/60">
          <Info className="h-4 w-4 shrink-0" /> Estimates may require final confirmation based on your home's
          condition and details.
        </p>
      </aside>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-foreground/70">{label}</dt>
      <dd className={cn("font-semibold", highlight && "text-fresh")}>{value}</dd>
    </div>
  );
}
