import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Reply } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/site/fields";
import { adminMessagesQuery, formatDateTime, LEAD_STATUSES } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminMessagesQuery),
  component: MessagesPage,
});

function MessagesPage() {
  const { data } = useSuspenseQuery(adminMessagesQuery);
  const qc = useQueryClient();
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
    onError: () => toast.error("Couldn't save. Please try again."),
  });

  return (
    <>
      <AdminHeader title="Messages" text="Messages sent from the Contact page." />
      <div className="space-y-4">
        {data.length === 0 && <EmptyState>No messages yet.</EmptyState>}
        {data.map((m) => (
          <AdminCard key={m.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{m.full_name}</h3>
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(m.created_at)} · {m.email}
                  {m.phone && ` · ${m.phone}`}
                  {m.service && ` · ${m.service}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-36">
                  <NativeSelect
                    className="h-10 capitalize"
                    value={m.status}
                    aria-label="Status"
                    onChange={(e) => setStatus.mutate({ id: m.id, status: e.target.value })}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
                <Button asChild variant="outline">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to MaidForLiving")}`}>
                    <Reply /> Reply
                  </a>
                </Button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{m.message}</p>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
