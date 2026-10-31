// Admin reads go through the browser client; RLS limits every table to admins.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

async function run<T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return (data ?? []) as T;
}

export const adminBookingsQuery = queryOptions({
  queryKey: ["admin", "bookings"],
  queryFn: () => run(supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(500)),
});

export const adminQuotesQuery = queryOptions({
  queryKey: ["admin", "quotes"],
  queryFn: () => run(supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(500)),
});

export const adminMessagesQuery = queryOptions({
  queryKey: ["admin", "messages"],
  queryFn: () => run(supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500)),
});

export const adminServicesQuery = queryOptions({
  queryKey: ["admin", "services"],
  queryFn: () => run(supabase.from("services").select("*").order("sort_order")),
});

export const adminPricingQuery = queryOptions({
  queryKey: ["admin", "pricing"],
  queryFn: () => run(supabase.from("pricing").select("*").order("sort_order")),
});

export const adminAreasQuery = queryOptions({
  queryKey: ["admin", "areas"],
  queryFn: () => run(supabase.from("service_areas").select("*").order("sort_order")),
});

export const adminReviewsQuery = queryOptions({
  queryKey: ["admin", "reviews"],
  queryFn: () => run(supabase.from("testimonials").select("*").order("created_at", { ascending: false })),
});

export const adminSettingsQuery = queryOptions({
  queryKey: ["admin", "settings"],
  queryFn: () => run(supabase.from("site_settings").select("*").order("sort_order")),
});

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
export const LEAD_STATUSES = ["new", "contacted", "closed"] as const;

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

export const formatDate = (ymd: string) =>
  new Date(`${ymd}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
