import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Settings,
  ShieldAlert,
  Star,
  Tag,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.user.id)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  },
  head: () => ({
    meta: [
      { title: "Admin | MaidForLiving" },
      { name: "description", content: "Manage MaidForLiving bookings, quotes, prices and website content." },
      { property: "og:title", content: "Admin | MaidForLiving" },
      { property: "og:description", content: "MaidForLiving admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
  { to: "/admin/quotes", label: "Quote Requests", Icon: FileText },
  { to: "/admin/messages", label: "Messages", Icon: Mail },
  { to: "/admin/pricing", label: "Prices & Services", Icon: Tag },
  { to: "/admin/areas", label: "Service Areas", Icon: MapPin },
  { to: "/admin/reviews", label: "Reviews", Icon: Star },
  { to: "/admin/settings", label: "Business Info", Icon: Settings },
] as const;

function AdminLayout() {
  const { isAdmin, user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="max-w-md rounded-3xl border border-border bg-card p-10 text-center shadow-elegant">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in as {user.email}, but this account isn't an admin. Ask the owner to give you access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">Back to website</Link>
            </Button>
            <Button onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-border bg-card lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:py-6">
          <Logo />
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
          {NAV.map(({ to, label, Icon, ...rest }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: "exact" in rest }}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="hidden space-y-2 border-t border-border px-5 py-5 lg:absolute lg:bottom-0 lg:block lg:w-full">
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ExternalLink /> Website
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut /> Sign out
            </Button>
          </div>
        </div>
      </aside>
      <div className="min-w-0 px-4 py-8 sm:px-8 lg:py-10">
        <Outlet />
      </div>
    </div>
  );
}
