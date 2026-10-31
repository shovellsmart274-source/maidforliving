import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeader, smallInput } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { adminPricingQuery, adminServicesQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/pricing")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminServicesQuery),
      context.queryClient.ensureQueryData(adminPricingQuery),
    ]),
  component: PricingAdmin,
});

const CATEGORY_LABELS: Record<string, string> = {
  rooms: "Extra rooms ($ each)",
  size: "Home size surcharge ($)",
  frequency: "Frequency discount (%)",
  addon: "Extras ($ each)",
};

function PricingAdmin() {
  const { data: services } = useSuspenseQuery(adminServicesQuery);
  const { data: pricing } = useSuspenseQuery(adminPricingQuery);
  const qc = useQueryClient();

  const [svc, setSvc] = useState(() =>
    Object.fromEntries(services.map((s) => [s.slug, { name: s.name, base_price: String(s.base_price), is_active: s.is_active, short_description: s.short_description }])),
  );
  const [amounts, setAmounts] = useState(() => Object.fromEntries(pricing.map((p) => [p.key, String(p.amount)])));

  const save = useMutation({
    mutationFn: async () => {
      for (const s of services) {
        const v = svc[s.slug]!;
        const base = Number(v.base_price);
        if (!Number.isFinite(base) || base < 0) throw new Error(`Invalid price for ${s.name}`);
        if (v.name !== s.name || base !== Number(s.base_price) || v.is_active !== s.is_active || v.short_description !== s.short_description) {
          const { error } = await supabase
            .from("services")
            .update({ name: v.name.trim(), base_price: base, is_active: v.is_active, short_description: v.short_description.trim() })
            .eq("slug", s.slug);
          if (error) throw error;
        }
      }
      for (const p of pricing) {
        const amount = Number(amounts[p.key]);
        if (!Number.isFinite(amount) || amount < 0) throw new Error(`Invalid amount for ${p.label}`);
        if (amount !== Number(p.amount)) {
          const { error } = await supabase.from("pricing").update({ amount }).eq("key", p.key);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast.success("Prices saved — the website now shows the new prices.");
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save prices."),
  });

  const categories = Array.from(new Set(pricing.map((p) => p.category)));

  return (
    <>
      <AdminHeader
        title="Prices & Services"
        text="Change starting prices, extras and discounts. The calculator, quote form and booking page update instantly."
        action={
          <Button size="lg" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} Save all changes
          </Button>
        }
      />

      <AdminCard>
        <h2 className="text-lg font-bold">Services & starting prices</h2>
        <div className="mt-4 divide-y divide-border">
          {services.map((s) => {
            const v = svc[s.slug]!;
            const set = (patch: Partial<typeof v>) => setSvc((all) => ({ ...all, [s.slug]: { ...v, ...patch } }));
            return (
              <div key={s.slug} className="grid gap-3 py-4 md:grid-cols-[1fr_140px_auto] md:items-start">
                <div className="space-y-2">
                  <input className={`${smallInput} font-semibold`} value={v.name} onChange={(e) => set({ name: e.target.value })} aria-label="Service name" />
                  <input className={smallInput} value={v.short_description} onChange={(e) => set({ short_description: e.target.value })} aria-label="Short description" />
                </div>
                <label className="relative block">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input type="number" min={0} step="1" className={`${smallInput} pl-7`} value={v.base_price} onChange={(e) => set({ base_price: e.target.value })} aria-label={`${s.name} starting price`} />
                </label>
                <label className="flex h-10 items-center gap-2 text-sm">
                  <Switch checked={v.is_active} onCheckedChange={(c) => set({ is_active: c })} /> {v.is_active ? "Shown" : "Hidden"}
                </label>
              </div>
            );
          })}
        </div>
      </AdminCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {categories.map((cat) => (
          <AdminCard key={cat}>
            <h2 className="text-lg font-bold">{CATEGORY_LABELS[cat] ?? cat}</h2>
            <div className="mt-4 space-y-3">
              {pricing
                .filter((p) => p.category === cat)
                .map((p) => (
                  <label key={p.key} className="grid grid-cols-[1fr_120px] items-center gap-3 text-sm">
                    <span>{p.label}</span>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      className={smallInput}
                      value={amounts[p.key]}
                      onChange={(e) => setAmounts((a) => ({ ...a, [p.key]: e.target.value }))}
                    />
                  </label>
                ))}
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
