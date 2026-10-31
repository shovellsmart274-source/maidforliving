import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { AdminCard, AdminHeader, EmptyState, smallInput } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { adminAreasQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/areas")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminAreasQuery),
  component: AreasPage,
});

const parseZips = (s: string) =>
  s
    .split(/[\s,]+/)
    .map((z) => z.trim())
    .filter((z) => /^\d{5}$/.test(z));

function useRefresh() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["admin", "areas"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  };
}

function AreasPage() {
  const { data } = useSuspenseQuery(adminAreasQuery);
  const refresh = useRefresh();
  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("service_areas")
        .insert({ city: "New area", state: "", zip_codes: [], is_active: false, sort_order: data.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Area added — fill in the details and save.");
      refresh();
    },
    onError: () => toast.error("Couldn't add the area."),
  });

  return (
    <>
      <AdminHeader
        title="Service Areas"
        text="Cities and ZIP codes you serve. Hidden areas don't appear on the website."
        action={
          <Button onClick={() => add.mutate()} disabled={add.isPending}>
            <Plus /> Add area
          </Button>
        }
      />
      <div className="space-y-4">
        {data.length === 0 && <EmptyState>No service areas yet.</EmptyState>}
        {data.map((a) => (
          <AreaRow key={a.id} a={a} />
        ))}
      </div>
    </>
  );
}

function AreaRow({ a }: { a: Tables<"service_areas"> }) {
  const refresh = useRefresh();
  const [v, setV] = useState({ city: a.city, state: a.state, zips: a.zip_codes.join(", "), description: a.description, is_active: a.is_active });
  const save = useMutation({
    mutationFn: async () => {
      if (!v.city.trim()) throw new Error("City is required");
      const { error } = await supabase
        .from("service_areas")
        .update({ city: v.city.trim(), state: v.state.trim(), zip_codes: parseZips(v.zips), description: v.description.trim(), is_active: v.is_active })
        .eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Area saved");
      refresh();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save."),
  });
  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("service_areas").delete().eq("id", a.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Area removed");
      refresh();
    },
    onError: () => toast.error("Couldn't remove."),
  });

  return (
    <AdminCard>
      <div className="grid gap-3 md:grid-cols-[1fr_120px_1.4fr]">
        <input className={smallInput} placeholder="City" value={v.city} onChange={(e) => setV({ ...v, city: e.target.value })} aria-label="City" />
        <input className={smallInput} placeholder="State" value={v.state} onChange={(e) => setV({ ...v, state: e.target.value })} aria-label="State" />
        <input className={smallInput} placeholder="ZIP codes, separated by commas" value={v.zips} onChange={(e) => setV({ ...v, zips: e.target.value })} aria-label="ZIP codes" />
      </div>
      <textarea
        rows={2}
        className={`${smallInput} mt-3 h-auto py-2`}
        placeholder="Short description"
        value={v.description}
        onChange={(e) => setV({ ...v, description: e.target.value })}
        aria-label="Description"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={v.is_active} onCheckedChange={(c) => setV({ ...v, is_active: c })} /> {v.is_active ? "Shown on website" : "Hidden"}
        </label>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            disabled={remove.isPending}
            onClick={() => window.confirm(`Remove ${a.city}?`) && remove.mutate()}
          >
            <Trash2 /> Remove
          </Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            Save
          </Button>
        </div>
      </div>
    </AdminCard>
  );
}
