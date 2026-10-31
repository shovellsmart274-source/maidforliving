import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { AdminCard, AdminHeader, EmptyState, StatusBadge, smallInput } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/site/fields";
import { adminBookingsQuery, BOOKING_STATUSES, formatDate, formatDateTime } from "@/lib/admin-data";
import { ADDONS, FREQUENCIES, HOME_SIZES, formatUSD, labelFor } from "@/lib/pricing";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminBookingsQuery),
  component: BookingsPage,
});

function BookingsPage() {
  const { data } = useSuspenseQuery(adminBookingsQuery);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const rows = data.filter(
    (b) =>
      (filter === "all" || b.status === filter) &&
      (!term || [b.full_name, b.email, b.booking_code, b.zip_code, b.phone].some((v) => v.toLowerCase().includes(term))),
  );

  return (
    <>
      <AdminHeader title="Bookings" text={`${data.length} total bookings`} />
      <div className="mb-6 flex flex-wrap gap-3">
        <input className={`${smallInput} max-w-xs`} placeholder="Search name, email, code, ZIP…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="w-48">
          <NativeSelect value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10">
            <option value="all">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="space-y-4">
        {rows.length === 0 && <EmptyState>No bookings match.</EmptyState>}
        {rows.map((b) => (
          <BookingCard key={b.id} b={b} />
        ))}
      </div>
    </>
  );
}

function BookingCard({ b }: { b: Tables<"bookings"> }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(b.admin_notes);
  const save = useMutation({
    mutationFn: async (values: Partial<Pick<Tables<"bookings">, "status" | "admin_notes">>) => {
      const { error } = await supabase.from("bookings").update(values).eq("id", b.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking updated");
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
    onError: () => toast.error("Couldn't save. Please try again."),
  });

  return (
    <AdminCard>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold">{b.full_name}</h3>
            <StatusBadge status={b.status} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {b.booking_code} · booked {formatDateTime(b.created_at)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold">{formatUSD(Number(b.estimated_price))}</p>
          <p className="text-xs text-muted-foreground">estimate</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Service</dt>
          <dd className="font-medium">{b.service_name}</dd>
          <dt className="text-muted-foreground">When</dt>
          <dd className="font-medium">
            {formatDate(b.preferred_date)}, {b.preferred_time}
          </dd>
          <dt className="text-muted-foreground">Home</dt>
          <dd>
            {b.bedrooms === 0 ? "Studio" : `${b.bedrooms} bed`} · {b.bathrooms} bath · {labelFor(HOME_SIZES, b.home_size)}
          </dd>
          <dt className="text-muted-foreground">Frequency</dt>
          <dd>{labelFor(FREQUENCIES, b.frequency)}</dd>
          {b.addons.length > 0 && (
            <>
              <dt className="text-muted-foreground">Extras</dt>
              <dd>{b.addons.map((a) => labelFor(ADDONS, a)).join(", ")}</dd>
            </>
          )}
        </dl>
        <ul className="space-y-1.5 text-sm">
          <li className="flex gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <a href={`tel:${b.phone}`} className="hover:underline">{b.phone}</a>
          </li>
          <li className="flex gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <a href={`mailto:${b.email}`} className="break-all hover:underline">{b.email}</a>
          </li>
          <li className="flex gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              {b.address} ({b.zip_code})
            </span>
          </li>
          {b.special_instructions && (
            <li className="rounded-lg bg-muted p-3 text-muted-foreground">“{b.special_instructions}”</li>
          )}
        </ul>
      </div>

      <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-[200px_1fr_auto] sm:items-start">
        <NativeSelect
          className="h-10 capitalize"
          value={b.status}
          disabled={save.isPending}
          onChange={(e) => save.mutate({ status: e.target.value })}
          aria-label="Booking status"
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NativeSelect>
        <textarea
          rows={1}
          className={`${smallInput} h-auto min-h-10 py-2`}
          placeholder="Private notes (only staff see these)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button variant="outline" disabled={save.isPending || notes === b.admin_notes} onClick={() => save.mutate({ admin_notes: notes })}>
          Save notes
        </Button>
      </div>
    </AdminCard>
  );
}
