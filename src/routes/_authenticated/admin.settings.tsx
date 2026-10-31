import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeader } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { FieldLabel, fieldInput } from "@/components/site/fields";
import { adminSettingsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminSettingsQuery),
  component: SettingsPage,
});

function SettingsPage() {
  const { data } = useSuspenseQuery(adminSettingsQuery);
  const qc = useQueryClient();
  const [values, setValues] = useState(() => Object.fromEntries(data.map((s) => [s.key, s.value])));

  const save = useMutation({
    mutationFn: async () => {
      for (const s of data) {
        const value = (values[s.key] ?? "").trim();
        if (value !== s.value) {
          const { error } = await supabase.from("site_settings").update({ value }).eq("key", s.key);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast.success("Business info saved — the website is updated.");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["public-data"] });
    },
    onError: () => toast.error("Couldn't save. Please try again."),
  });

  return (
    <>
      <AdminHeader
        title="Business Info"
        text="Phone, email, address, opening hours and social links shown across the website."
        action={
          <Button size="lg" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} Save changes
          </Button>
        }
      />
      <AdminCard>
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((s) => (
            <div key={s.key} className={s.key === "announcement" || s.key === "address" ? "md:col-span-2" : undefined}>
              <FieldLabel htmlFor={`set-${s.key}`}>{s.label}</FieldLabel>
              <input
                id={`set-${s.key}`}
                className={fieldInput}
                value={values[s.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}
