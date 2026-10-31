import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeader, EmptyState } from "@/components/admin/AdminUi";
import { NativeSelect } from "@/components/site/fields";
import { adminQuotesQuery, formatDateTime, LEAD_STATUSES } from "@/lib/admin-data";
import { HOME_SIZES, formatUSD, labelFor } from "@/lib/pricing";

export const Route = createFileRoute("/_authenticated/admin/quotes")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminQuotesQuery),
  component: QuotesPage,
});

function QuotesPage() {
  const { data } = useSuspenseQuery(adminQuotesQuery);
  const qc = useQueryClient();
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin", "quotes"] });
    },
    onError: () => toast.error("Couldn't save. Please try again."),
  });

  return (
    <>
      <AdminHeader title="Quote Requests" text="People who asked for a price from the home page form." />
      {data.length === 0 ? (
        <EmptyState>No quote requests yet.</EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((q) => (
            <AdminCard key={q.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{q.full_name || "No name given"}</h3>
                  <p className="text-xs text-muted-foreground">{formatDateTime(q.created_at)}</p>
                </div>
                <p className="font-display text-xl font-bold">{formatUSD(Number(q.estimated_price))}</p>
              </div>
              <p className="mt-3 text-sm">
                {q.cleaning_type} · {q.bedrooms === 0 ? "Studio" : `${q.bedrooms} bed`} · {q.bathrooms} bath ·{" "}
                {labelFor(HOME_SIZES, q.home_size)} · ZIP {q.zip_code}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {q.email && (
                  <a href={`mailto:${q.email}`} className="hover:underline">
                    {q.email}
                  </a>
                )}
                {q.email && q.phone && " · "}
                {q.phone && (
                  <a href={`tel:${q.phone}`} className="hover:underline">
                    {q.phone}
                  </a>
                )}
                {!q.email && !q.phone && "No contact details left"}
              </p>
              <div className="mt-4 w-44">
                <NativeSelect
                  className="h-10 capitalize"
                  value={q.status}
                  aria-label="Status"
                  onChange={(e) => setStatus.mutate({ id: q.id, status: e.target.value })}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </>
  );
}
