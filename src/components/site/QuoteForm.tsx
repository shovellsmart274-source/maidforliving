import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/use-public-data";
import { calculateEstimate, formatUSD, HOME_SIZES } from "@/lib/pricing";
import { submitQuote } from "@/lib/public-data.functions";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  bathroomLabel,
  bedroomLabel,
  FieldLabel,
  fieldInput,
  NativeSelect,
} from "./fields";

export function QuoteForm() {
  const { services, pricing } = usePricing();
  const submit = useServerFn(submitQuote);
  const [zip, setZip] = useState("");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [homeSize, setHomeSize] = useState<string>("size_1000_1999");
  const [cleaningType, setCleaningType] = useState(services[0]?.slug ?? "standard-house-cleaning");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const live = useMemo(() => {
    const svc = services.find((s) => s.slug === cleaningType);
    return calculateEstimate({ basePrice: svc?.base_price ?? 0, bedrooms, bathrooms, homeSize }, pricing);
  }, [services, cleaningType, bedrooms, bathrooms, homeSize, pricing]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      toast.error("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setLoading(true);
    try {
      const res = await submit({ data: { zipCode: zip, bedrooms, bathrooms, homeSize, cleaningType, email, fullName: "", phone: "" } });
      setResult(res.total);
      toast.success("Your free quote is ready!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (result !== null) {
    return (
      <div className="rounded-3xl border bg-card p-7 text-center shadow-card sm:p-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-fresh" />
        <h3 className="mt-4 text-xl font-bold">Your estimated price</h3>
        <p className="mt-2 font-display text-5xl font-bold text-primary">{formatUSD(result)}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Estimate only — final price is confirmed after we review your home details.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild variant="hero" size="lg">
            <Link
              to="/book"
              search={{ service: cleaningType, bedrooms, bathrooms, zip, size: homeSize }}
            >
              BOOK THIS CLEANING
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => setResult(null)}>
            Get another quote
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border bg-card p-6 shadow-card sm:p-7" aria-label="Instant quote">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-primary">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold leading-tight">Instant Free Quote</h2>
          <p className="text-xs text-muted-foreground">Takes less than 60 seconds</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <FieldLabel htmlFor="q-zip">ZIP Code</FieldLabel>
          <input
            id="q-zip"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g. 10001"
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
            className={fieldInput}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <FieldLabel htmlFor="q-size">Home Size</FieldLabel>
          <NativeSelect id="q-size" value={homeSize} onChange={(e) => setHomeSize(e.target.value)}>
            {HOME_SIZES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <FieldLabel htmlFor="q-bed">Bedrooms</FieldLabel>
          <NativeSelect id="q-bed" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))}>
            {BEDROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {bedroomLabel(n)}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <FieldLabel htmlFor="q-bath">Bathrooms</FieldLabel>
          <NativeSelect id="q-bath" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))}>
            {BATHROOM_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {bathroomLabel(n)}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="col-span-2">
          <FieldLabel htmlFor="q-type">Cleaning Type</FieldLabel>
          <NativeSelect id="q-type" value={cleaningType} onChange={(e) => setCleaningType(e.target.value)}>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="col-span-2">
          <FieldLabel htmlFor="q-email">Email (optional)</FieldLabel>
          <input
            id="q-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldInput}
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-accent px-4 py-3">
        <span className="text-sm font-medium text-accent-foreground">Estimated from</span>
        <span className="font-display text-2xl font-bold text-primary">{formatUSD(live.total)}</span>
      </div>
      <Button type="submit" variant="hero" size="lg" className="mt-4 w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />} GET MY FREE QUOTE
      </Button>
    </form>
  );
}
