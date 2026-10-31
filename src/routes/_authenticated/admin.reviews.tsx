import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { AdminCard, AdminHeader, EmptyState, smallInput } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { adminReviewsQuery } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminReviewsQuery),
  component: ReviewsPage,
});

function useRefresh() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  };
}

function ReviewsPage() {
  const { data } = useSuspenseQuery(adminReviewsQuery);
  const refresh = useRefresh();
  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("testimonials")
        .insert({ customer_name: "Customer name", review: "Write the review here.", rating: 5, is_published: false, is_sample: false });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review added — edit it, then switch it on to publish.");
      refresh();
    },
    onError: () => toast.error("Couldn't add the review."),
  });

  return (
    <>
      <AdminHeader
        title="Reviews"
        text="Add real customer reviews and choose which ones appear on the website."
        action={
          <Button onClick={() => add.mutate()} disabled={add.isPending}>
            <Plus /> Add review
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {data.length === 0 && <EmptyState>No reviews yet.</EmptyState>}
        {data.map((r) => (
          <ReviewRow key={r.id} r={r} />
        ))}
      </div>
    </>
  );
}

function ReviewRow({ r }: { r: Tables<"testimonials"> }) {
  const refresh = useRefresh();
  const [v, setV] = useState({
    customer_name: r.customer_name,
    location: r.location,
    rating: r.rating,
    review: r.review,
    is_published: r.is_published,
  });
  const save = useMutation({
    mutationFn: async () => {
      if (!v.customer_name.trim() || !v.review.trim()) throw new Error("Name and review are required");
      // Edited reviews are treated as real, so the "sample" label is removed.
      const { error } = await supabase
        .from("testimonials")
        .update({ ...v, customer_name: v.customer_name.trim(), review: v.review.trim(), location: v.location.trim(), is_sample: false })
        .eq("id", r.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review saved");
      refresh();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save."),
  });
  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("testimonials").delete().eq("id", r.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted");
      refresh();
    },
    onError: () => toast.error("Couldn't delete."),
  });

  return (
    <AdminCard>
      {r.is_sample && (
        <p className="mb-3 rounded-lg bg-star/15 px-3 py-2 text-xs font-medium">Sample review — replace it with a real one or delete it.</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={smallInput} value={v.customer_name} onChange={(e) => setV({ ...v, customer_name: e.target.value })} aria-label="Customer name" />
        <input className={smallInput} placeholder="Location (e.g. city)" value={v.location} onChange={(e) => setV({ ...v, location: e.target.value })} aria-label="Location" />
      </div>
      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setV({ ...v, rating: n })} aria-label={`${n} stars`} aria-checked={v.rating === n} role="radio">
            <Star className={cn("h-6 w-6", n <= v.rating ? "fill-star text-star" : "text-border")} />
          </button>
        ))}
      </div>
      <textarea rows={3} className={`${smallInput} mt-3 h-auto py-2`} value={v.review} onChange={(e) => setV({ ...v, review: e.target.value })} aria-label="Review" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={v.is_published} onCheckedChange={(c) => setV({ ...v, is_published: c })} /> {v.is_published ? "Published" : "Hidden"}
        </label>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => window.confirm("Delete this review?") && remove.mutate()}>
            <Trash2 /> Delete
          </Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            Save
          </Button>
        </div>
      </div>
    </AdminCard>
  );
}
