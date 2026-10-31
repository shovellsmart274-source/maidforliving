import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarCheck, DollarSign, FileText, Mail } from "lucide-react";
import { AdminCard, AdminHeader, EmptyState, StatusBadge } from "@/components/admin/AdminUi";
import { adminBookingsQuery, adminMessagesQuery, adminQuotesQuery, formatDate } from "@/lib/admin-data";
import { formatUSD } from "@/lib/pricing";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminBookingsQuery),
      context.queryClient.ensureQueryData(adminQuotesQuery),
      context.queryClient.ensureQueryData(adminMessagesQuery),
    ]),
  component: Dashboard,
});

function Dashboard() {
  const { data: bookings } = useSuspenseQuery(adminBookingsQuery);
  const { data: quotes } = useSuspenseQuery(adminQuotesQuery);
  const { data: messages } = useSuspenseQuery(adminMessagesQuery);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const upcomingValue = bookings
    .filter((b) => b.status === "pending" || b.status === "confirmed")
    .reduce((s, b) => s + Number(b.estimated_price), 0);

  const stats = [
    { label: "Bookings waiting", value: pending, Icon: CalendarCheck, to: "/admin/bookings" as const },
    { label: "Upcoming value", value: formatUSD(upcomingValue), Icon: DollarSign, to: "/admin/bookings" as const },
    { label: "New quote requests", value: quotes.filter((q) => q.status === "new").length, Icon: FileText, to: "/admin/quotes" as const },
    { label: "New messages", value: messages.filter((m) => m.status === "new").length, Icon: Mail, to: "/admin/messages" as const },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" text="A quick look at what needs your attention." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, Icon, to }) => (
          <Link key={label} to={to}>
            <AdminCard className="transition-shadow hover:shadow-elegant">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-4 font-display text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-bold">Latest bookings</h2>
        <Link to="/admin/bookings" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {bookings.length === 0 && <EmptyState>No bookings yet. They'll appear here as soon as customers book online.</EmptyState>}
        {bookings.slice(0, 6).map((b) => (
          <AdminCard key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-4 sm:py-4">
            <div>
              <p className="font-semibold">{b.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {b.service_name} · {formatDate(b.preferred_date)} · {b.preferred_time}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{formatUSD(Number(b.estimated_price))}</span>
              <StatusBadge status={b.status} />
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
