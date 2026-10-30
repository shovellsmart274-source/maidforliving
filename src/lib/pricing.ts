// Pure price-estimate logic shared by the quote form, calculator, booking
// wizard (client preview) and the booking server function (source of truth).

export type PricingMap = Record<string, number>;

export const HOME_SIZES = [
  { key: "size_under_1000", label: "Under 1,000 sq ft" },
  { key: "size_1000_1999", label: "1,000 – 1,999 sq ft" },
  { key: "size_2000_2999", label: "2,000 – 2,999 sq ft" },
  { key: "size_3000_plus", label: "3,000+ sq ft" },
] as const;

export const FREQUENCIES = [
  { key: "freq_one_time", label: "One-Time" },
  { key: "freq_weekly", label: "Weekly" },
  { key: "freq_biweekly", label: "Biweekly" },
  { key: "freq_monthly", label: "Monthly" },
] as const;

export const ADDONS = [
  { key: "addon_fridge", label: "Inside Fridge" },
  { key: "addon_oven", label: "Inside Oven" },
  { key: "addon_windows", label: "Interior Windows" },
  { key: "addon_cabinets", label: "Inside Cabinets" },
  { key: "addon_laundry", label: "Laundry & Folding" },
  { key: "addon_baseboards", label: "Baseboard Detailing" },
] as const;

export const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
] as const;

export interface EstimateInput {
  basePrice: number;
  bedrooms: number;
  bathrooms: number;
  homeSize: string;
  frequency?: string;
  addons?: string[];
}

export interface Estimate {
  base: number;
  rooms: number;
  size: number;
  addons: number;
  subtotal: number;
  discountPct: number;
  discount: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateEstimate(input: EstimateInput, pricing: PricingMap): Estimate {
  const p = (key: string) => Number(pricing[key] ?? 0);
  const base = Math.max(0, Number(input.basePrice) || 0);
  const bedrooms = Math.max(0, Math.floor(input.bedrooms || 0));
  const bathrooms = Math.max(0, Math.floor(input.bathrooms || 0));

  const rooms =
    Math.max(0, bedrooms - 1) * p("per_extra_bedroom") +
    Math.max(0, bathrooms - 1) * p("per_extra_bathroom");
  const size = input.homeSize.startsWith("size_") ? p(input.homeSize) : 0;
  const uniqueAddons = Array.from(new Set(input.addons ?? [])).filter((a) => a.startsWith("addon_"));
  const addons = uniqueAddons.reduce((sum, key) => sum + p(key), 0);

  const subtotal = round2(base + rooms + size + addons);
  const freqKey = input.frequency ?? "freq_one_time";
  const discountPct = freqKey.startsWith("freq_") ? Math.min(100, Math.max(0, p(freqKey))) : 0;
  const discount = round2((subtotal * discountPct) / 100);
  const total = round2(subtotal - discount);

  return { base, rooms, size, addons, subtotal, discountPct, discount, total };
}

export function toPricingMap(rows: { key: string; amount: number | string }[]): PricingMap {
  return Object.fromEntries(rows.map((r) => [r.key, Number(r.amount)]));
}

export const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    n,
  );

export const labelFor = (list: readonly { key: string; label: string }[], key: string) =>
  list.find((i) => i.key === key)?.label ?? key;
