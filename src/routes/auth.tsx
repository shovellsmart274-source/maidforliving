import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { FieldLabel, fieldInput } from "@/components/site/fields";
import { safeRedirect } from "@/lib/safe-redirect";

const REDIRECT_KEY = "mfl-auth-redirect";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: z.object({ redirect: z.string().optional() }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const stored = typeof window !== "undefined" ? sessionStorage.getItem(REDIRECT_KEY) : null;
      if (stored) sessionStorage.removeItem(REDIRECT_KEY);
      throw redirect({ to: safeRedirect(search.redirect ?? stored) });
    }
  },
  head: () => ({
    meta: [
      { title: "Staff Sign In | MaidForLiving" },
      { name: "description", content: "Sign in to the MaidForLiving staff area to manage bookings and website content." },
      { property: "og:title", content: "Staff Sign In | MaidForLiving" },
      { property: "og:description", content: "MaidForLiving staff and admin sign in." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const target = safeRedirect(search.redirect);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: target, replace: true });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your email.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    sessionStorage.setItem(REDIRECT_KEY, target);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    sessionStorage.removeItem(REDIRECT_KEY);
    navigate({ to: target, replace: true });
  }

  const title = mode === "signin" ? "Staff sign in" : mode === "signup" ? "Create staff account" : "Reset password";

  return (
    <section className="bg-muted py-20 sm:py-28">
      <div className="container-page flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Enter your email and we'll send you a reset link."
              : "For MaidForLiving owners and staff to manage bookings and the website."}
          </p>

          {mode !== "forgot" && (
            <>
              <Button type="button" variant="outline" size="lg" className="mt-7 w-full" onClick={google}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 3.72 14.56 2.8 12 2.8 6.92 2.8 2.8 6.92 2.8 12s4.12 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.99 0-.6-.07-1.06-.15-1.51z" />
                </svg>
                Continue with Google
              </Button>
              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
            </>
          )}

          <form onSubmit={onSubmit} className={mode === "forgot" ? "mt-7 space-y-4" : "space-y-4"}>
            <div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <input id="email" type="email" required autoComplete="email" className={fieldInput} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== "forgot" && (
              <div>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className={fieldInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm">
            {mode === "signin" ? (
              <>
                <button type="button" className="font-semibold text-primary hover:underline" onClick={() => setMode("forgot")}>
                  Forgot password?
                </button>
                <button type="button" className="font-semibold text-primary hover:underline" onClick={() => setMode("signup")}>
                  Create an account
                </button>
              </>
            ) : (
              <button type="button" className="font-semibold text-primary hover:underline" onClick={() => setMode("signin")}>
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
