import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FieldLabel, fieldInput } from "@/components/site/fields";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a New Password | MaidForLiving" },
      { name: "description", content: "Choose a new password for your MaidForLiving staff account." },
      { property: "og:title", content: "Set a New Password | MaidForLiving" },
      { property: "og:description", content: "Reset your MaidForLiving staff password." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    supabase.auth.getSession().then(({ data }) => setReady(isRecovery || !!data.session));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    navigate({ to: "/admin", replace: true });
  }

  return (
    <section className="bg-muted py-20 sm:py-28">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-10">
          <h1 className="text-3xl font-bold">Set a new password</h1>
          {ready ? (
            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <div>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <input id="new-password" type="password" required minLength={8} autoComplete="new-password" className={fieldInput} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />} Save password
              </Button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Open this page from the reset link in your email to choose a new password.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
