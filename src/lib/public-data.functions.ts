import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { calculateEstimate, toPricingMap } from "./pricing";

export interface PublicService {
  slug: string;
  name: string;
  short_description: string;
  base_price: number;
  sort_order: number;
}
export interface PublicArea {
  id: string;
  city: string;
  state: string;
  zip_codes: string[];
  description: string;
}
export interface PublicTestimonial {
  id: string;
  customer_name: string;
  location: string;
  rating: number;
  review: string;
  is_sample: boolean;
}
export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  hours_weekdays: string;
  hours_saturday: string;
  hours_sunday: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  announcement: string;
}
export interface PublicData {
  services: PublicService[];
  pricing: { key: string; label: string; category: string; amount: number }[];
  areas: PublicArea[];
  testimonials: PublicTestimonial[];
  settings: SiteSettings;
}

async function publicClient() {
  const { createClient } = await import("@supabase/supabase-js");
  // Hosts outside Lovable (e.g. Vercel) don't inject server env vars at runtime,
  // so fall back to the public values Vite inlines at build time.
  const url = process.env["SUPABASE_URL"] || import.meta.env.VITE_SUPABASE_URL;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Backend connection is not configured.");
  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const getPublicData = createServerFn({ method: "GET" }).handler(async (): Promise<PublicData> => {
  const sb = await publicClient();
  const [services, pricing, areas, testimonials, settings] = await Promise.all([
    sb.from("services").select("slug,name,short_description,base_price,sort_order").eq("is_active", true).order("sort_order"),
    sb.from("pricing").select("key,label,category,amount").order("sort_order"),
    sb.from("service_areas").select("id,city,state,zip_codes,description").eq("is_active", true).order("sort_order"),
    sb.from("testimonials").select("id,customer_name,location,rating,review,is_sample").eq("is_published", true).order("created_at", { ascending: false }),
    sb.from("site_settings").select("key,value"),
  ]);
  const err = services.error || pricing.error || areas.error || testimonials.error || settings.error;
  if (err) console.error("[public-data]", err.message);
  return {
    services: (services.data ?? []).map((s) => ({ ...s, base_price: Number(s.base_price) })),
    pricing: (pricing.data ?? []).map((p) => ({ ...p, amount: Number(p.amount) })),
    areas: areas.data ?? [],
    testimonials: testimonials.data ?? [],
    settings: Object.fromEntries((settings.data ?? []).map((s) => [s.key, s.value])) as unknown as SiteSettings,
  };
});

export const publicDataQuery = queryOptions({
  queryKey: ["public-data"],
  queryFn: () => getPublicData(),
  staleTime: 60_000,
});

// ---------- Booking ----------

const bookingSchema = z.object({
  serviceSlug: z.string().min(1).max(80),
  bedrooms: z.number().int().min(0).max(12),
  bathrooms: z.number().int().min(1).max(12),
  zipCode: z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP code"),
  homeSize: z.string().startsWith("size_").max(40),
  frequency: z.string().startsWith("freq_").max(40),
  addons: z.array(z.string().startsWith("addon_").max(40)).max(10),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.string().min(1).max(40),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(5).max(300),
  specialInstructions: z.string().trim().max(1000).default(""),
});
export type BookingInput = z.infer<typeof bookingSchema>;

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return "MFL-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: BookingInput) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: service }, { data: pricingRows }] = await Promise.all([
      supabaseAdmin.from("services").select("slug,name,base_price,is_active").eq("slug", data.serviceSlug).maybeSingle(),
      supabaseAdmin.from("pricing").select("key,amount"),
    ]);
    if (!service || !service.is_active) throw new Error("Selected service is not available.");

    const estimate = calculateEstimate(
      {
        basePrice: Number(service.base_price),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        homeSize: data.homeSize,
        frequency: data.frequency,
        addons: data.addons,
      },
      toPricingMap(pricingRows ?? []),
    );

    const email = data.email.toLowerCase();
    const { data: customer, error: custErr } = await supabaseAdmin
      .from("customers")
      .upsert(
        { email, full_name: data.fullName, phone: data.phone, address: data.address },
        { onConflict: "email" },
      )
      .select("id")
      .single();
    if (custErr) {
      console.error("[booking] customer", custErr.message);
      throw new Error("We couldn't save your booking. Please try again.");
    }

    const code = makeCode();
    const { error } = await supabaseAdmin.from("bookings").insert({
      booking_code: code,
      customer_id: customer.id,
      service_slug: service.slug,
      service_name: service.name,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      zip_code: data.zipCode,
      home_size: data.homeSize,
      frequency: data.frequency,
      addons: data.addons,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      full_name: data.fullName,
      email,
      phone: data.phone,
      address: data.address,
      special_instructions: data.specialInstructions,
      estimated_price: estimate.total,
    });
    if (error) {
      console.error("[booking] insert", error.message);
      throw new Error("We couldn't save your booking. Please try again.");
    }
    return { code, total: estimate.total };
  });

export const getBookingByCode = createServerFn({ method: "GET" })
  .inputValidator((data: { code: string }) => z.object({ code: z.string().regex(/^MFL-[A-Z0-9]{8}$/) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b } = await supabaseAdmin
      .from("bookings")
      .select(
        "booking_code,service_name,bedrooms,bathrooms,zip_code,home_size,frequency,addons,preferred_date,preferred_time,full_name,estimated_price,status,created_at",
      )
      .eq("booking_code", data.code)
      .maybeSingle();
    if (!b) return null;
    return { ...b, estimated_price: Number(b.estimated_price) };
  });

// ---------- Quote requests ----------

const quoteSchema = z.object({
  zipCode: z.string().trim().regex(/^\d{5}$/, "Enter a 5-digit ZIP code"),
  bedrooms: z.number().int().min(0).max(12),
  bathrooms: z.number().int().min(1).max(12),
  homeSize: z.string().startsWith("size_").max(40),
  cleaningType: z.string().min(1).max(80),
  fullName: z.string().trim().max(120).default(""),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]).default(""),
  phone: z.string().trim().max(30).default(""),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((data: QuoteInput) => quoteSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: service }, { data: pricingRows }] = await Promise.all([
      supabaseAdmin.from("services").select("name,base_price").eq("slug", data.cleaningType).maybeSingle(),
      supabaseAdmin.from("pricing").select("key,amount"),
    ]);
    const estimate = calculateEstimate(
      {
        basePrice: Number(service?.base_price ?? 0),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        homeSize: data.homeSize,
      },
      toPricingMap(pricingRows ?? []),
    );
    const { error } = await supabaseAdmin.from("quote_requests").insert({
      zip_code: data.zipCode,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      home_size: data.homeSize,
      cleaning_type: service?.name ?? data.cleaningType,
      estimated_price: estimate.total,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
    });
    if (error) {
      console.error("[quote] insert", error.message);
      throw new Error("We couldn't save your quote request. Please try again.");
    }
    return { total: estimate.total };
  });

// ---------- Contact ----------

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).default(""),
  service: z.string().trim().max(120).default(""),
  message: z.string().trim().min(5).max(3000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: ContactInput) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
    });
    if (error) {
      console.error("[contact] insert", error.message);
      throw new Error("We couldn't send your message. Please try again.");
    }
    return { ok: true };
  });
