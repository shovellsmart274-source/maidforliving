import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookingByCode } from "@/lib/public-data.functions";
import { formatUSD, FREQUENCIES, HOME_SIZES, labelFor } from "@/lib/pricing";

export const Route = createFileRoute("/booking-confirmation/$code")({
  loader: async ({ params }) => {
    if (!/^MFL-[A-Z0-9]{8}$/.test(params.code)) throw notFound();
    const booking = await getBookingByCode({ data: { code: params.code } });
    if (!booking) throw notFound();
    return booking;
  },
  head: () => ({
    meta: [
      { title: "Booking Confirmed | MaidForLiving" },
      { name: "description", content: "Your MaidForLiving cleaning booking has been received." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const b = Route.useLoaderData();
  return (
    <section className="bg-gradient-soft py-16 sm:py-24">
      <div className="container-page max-w-3xl">
        <div className="rounded-[2rem] border bg-card p-7 text-center shadow-card sm:p-12">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-fresh text-primary-foreground shadow-elegant">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Thank you, {b.full_name.split(" ")[0]}!</h1>
          <p className="mt-3 text-muted-foreground">Your booking request has been received. Our team will confirm your appointment shortly.</p>
          <div className="mx-auto mt-7 w-fit rounded-2xl border-2 border-dashed border-primary/40 bg-accent px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booking ID</p>
            <p className="font-display text-2xl font-bold tracking-wider text-primary">{b.booking_code}</p>
          </div>
          <dl className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            <Item k="Service" v={b.service_name} />
            <Item k="Date & time" v={`${b.preferred_date} · ${b.preferred_time}`} />
            <Item k="Rooms" v={`${b.bedrooms === 0 ? "Studio" : `${b.bedrooms} bed`}, ${b.bathrooms} bath`} />
            <Item k="Property size" v={labelFor(HOME_SIZES, b.home_size)} />
            <Item k="Frequency" v={labelFor(FREQUENCIES, b.frequency)} />
            <Item k="Status" v={b.status.charAt(0).toUpperCase() + b.status.slice(1)} />
          </dl>
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-ink px-6 py-4 text-ink-foreground">
            <span className="text-sm">Estimated price</span>
            <span className="font-display text-3xl font-bold">{formatUSD(b.estimated_price)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Final price is confirmed by our team before your cleaning.</p>
          <ul className="mt-8 space-y-2 text-left text-sm text-muted-foreground">
            <li className="flex gap-2"><Mail className="h-4 w-4 text-primary" /> Keep your booking ID for any changes or questions.</li>
            <li className="flex gap-2"><CalendarCheck className="h-4 w-4 text-primary" /> We'll reach out to confirm your time window.</li>
          </ul>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link to="/"><Home /> Back to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="mt-1 font-semibold">{v}</dd>
    </div>
  );
}
