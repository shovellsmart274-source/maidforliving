import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeDollarSign,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  Home,
  Phone,
  Quote,
  Search,
  ShieldCheck,
  Smile,
  Sofa,
  Sparkles,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import aboutImg from "@/assets/about-family.jpg";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/services-data";
import { usePublicData, useSettings } from "@/hooks/use-public-data";
import { formatUSD } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <span className="eyebrow">
          <span className="h-px w-6 bg-primary" /> {eyebrow}
        </span>
      )}
      <Tag className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]">{title}</Tag>
      {text && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{text}</p>}
    </div>
  );
}

export function PageBanner({
  title,
  subtitle,
  image,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  image: string;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <img src={image} alt="" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover animate-ken-burns" />
      <div className="absolute inset-0 -z-10 bg-banner-overlay" />
      <div className="container-page py-20 text-center text-ink-foreground sm:py-28">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-foreground/80">
          <Link to="/" className="hover:text-fresh">
            Home
          </Link>
          {crumbs?.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <span className="text-fresh">/</span>
              {c.to ? (
                <Link to={c.to} className="hover:text-fresh">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="animate-fade-up mx-auto max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && (
          <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-base text-ink-foreground/85 sm:text-lg [animation-delay:120ms]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

const TRUST = [
  { Icon: Users, title: "Experienced Cleaning Professionals", text: "Trained teams who follow detailed checklists in every room." },
  { Icon: ShieldCheck, title: "Reliable Cleaning Services", text: "On-time arrivals and consistent results visit after visit." },
  { Icon: CalendarClock, title: "Flexible Scheduling", text: "Pick the day and time that fits your life — book online in minutes." },
  { Icon: BadgeDollarSign, title: "Affordable Pricing", text: "Clear, upfront estimates with savings on recurring plans." },
  { Icon: Award, title: "Quality Cleaning Standards", text: "Attention to detail from baseboards to bathroom fixtures." },
  { Icon: Smile, title: "Customer Satisfaction", text: "Your feedback shapes every visit. Not happy? Tell us and we'll make it right." },
];

export function TrustSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why homeowners choose us"
          title="Professional Cleaning You Can Trust"
          text="From your first booking to every sparkling surface, we focus on the details that make a home feel cared for."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST.map(({ Icon, title, text }) => (
            <div key={title} className="card-lift group rounded-3xl border bg-card p-7 shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary transition-colors duration-300 group-hover:bg-gradient-fresh group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { Icon: CalendarDays, title: "Book Your Cleaning", text: "Choose your cleaning service and preferred schedule." },
  { Icon: Sparkles, title: "We Clean Your Home", text: "Our cleaning professionals take care of your home." },
  { Icon: Sofa, title: "Enjoy Your Free Time", text: "Relax and enjoy a fresh, spotless home." },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-soft py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="How it works" title="Three Simple Steps to a Spotless Home" />
        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden border-t-2 border-dashed border-primary/30 md:block" />
          {STEPS.map(({ Icon, title, text }, i) => (
            <div key={title} className="relative text-center">
              <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-background shadow-card">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-fresh text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-ink font-display text-sm font-bold text-ink-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold">
                Step {i + 1}: {title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/book">
              Start Booking <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function AboutTeaser({ showButton = true }: { showButton?: boolean }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <div className="relative">
          <img
            src={aboutImg}
            alt="Happy family relaxing in a clean, bright living room"
            width={1200}
            height={1008}
            loading="lazy"
            className="aspect-[6/5] w-full rounded-[2rem] object-cover shadow-card"
          />
          <div className="absolute -bottom-6 -right-2 rounded-3xl bg-background p-5 shadow-card sm:-right-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-fresh text-primary-foreground">
                <HeartHandshake className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-lg font-bold">Customer-first</p>
                <p className="text-xs text-muted-foreground">Care in every visit</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="About MaidForLiving"
            title="Your Trusted Partner for a Cleaner Home"
          />
          <p className="mt-5 leading-relaxed text-muted-foreground">
            At MaidForLiving, we believe a clean home is the foundation of a happier, healthier life. Our
            professional cleaners bring care, consistency and attention to detail to every visit — so you can
            spend less time cleaning and more time living.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We are committed to quality, reliability and customer satisfaction. Every cleaning follows a
            detailed checklist, and every plan can be customized to fit your home and schedule.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Detailed room-by-room checklists", "Easy online booking", "Customized cleaning plans", "Eco-conscious options"].map(
              (t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-fresh" /> {t}
                </li>
              ),
            )}
          </ul>
          {showButton && (
            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/about">
                Learn More <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const { services } = usePublicData();
  const priceFor = (slug: string) => services.find((s) => s.slug === slug)?.base_price;
  const items = SERVICES.filter((s) => services.length === 0 || services.some((x) => x.slug === s.slug)).slice(0, limit);
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => {
        const price = priceFor(s.slug);
        const dbName = services.find((x) => x.slug === s.slug);
        return (
          <article key={s.slug} className="card-lift group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft">
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src={s.image}
                alt={`${s.name} by MaidForLiving`}
                width={1200}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {price !== undefined && (
                <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-bold text-primary shadow-soft">
                  From {formatUSD(price)}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold">{dbName?.name ?? s.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {dbName?.short_description || s.short}
              </p>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover:gap-3"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

const WHY = [
  { Icon: Users, title: "Professional Cleaning Team", text: "Courteous, trained cleaners who respect your home." },
  { Icon: ClipboardCheck, title: "Customized Cleaning Plans", text: "Tell us your priorities and we tailor every visit." },
  { Icon: BadgeDollarSign, title: "Affordable Cleaning Options", text: "Upfront estimates and recurring-plan savings." },
  { Icon: CalendarClock, title: "Flexible Booking", text: "Book online 24/7 and choose your preferred time." },
  { Icon: Search, title: "Attention to Detail", text: "We notice the corners, edges and fixtures others miss." },
  { Icon: HeartHandshake, title: "Customer-Focused Service", text: "Friendly support before, during and after each clean." },
];

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-ink-foreground sm:py-28">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-fresh/20 blur-3xl" />
      <div className="container-page relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="eyebrow text-fresh">
            <span className="h-px w-6 bg-fresh" /> The MaidForLiving difference
          </span>
          <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Why Choose MaidForLiving?</h2>
          <p className="mt-5 max-w-md text-ink-foreground/75">
            We combine dependable people, thoughtful processes and simple online booking to deliver a cleaning
            experience that feels effortless.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link to="/book">Book Your Cleaning</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/pricing">Calculate Price</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {WHY.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-ink-foreground/10 bg-ink-foreground/5 p-6 backdrop-blur transition-colors duration-300 hover:border-fresh/50 hover:bg-ink-foreground/10"
            >
              <Icon className="h-8 w-8 text-fresh" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-foreground/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { testimonials } = usePublicData();
  if (testimonials.length === 0) return null;
  const hasSample = testimonials.some((t) => t.is_sample);
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Testimonials" title="What Our Customers Say" />
        {hasSample && (
          <p className="mx-auto mt-4 w-fit rounded-full bg-sky px-4 py-1.5 text-center text-xs font-semibold text-sky-foreground">
            Sample reviews shown for preview — real customer reviews coming soon.
          </p>
        )}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 6).map((t) => (
            <figure key={t.id} className="card-lift relative rounded-3xl border bg-card p-7 shadow-soft">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-accent" fill="currentColor" />
              <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < t.rating ? "text-star" : "text-border")} fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-4 leading-relaxed text-foreground/85">“{t.review}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-fresh font-display font-bold text-primary-foreground">
                  {t.customer_name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold">
                    {t.customer_name}
                    {t.is_sample && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">Sample</span>}
                  </span>
                  <span className="text-xs text-muted-foreground">{t.location}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner({ title = "Ready for a Spotless Home?", text }: { title?: string; text?: string }) {
  const s = useSettings();
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-fresh px-6 py-14 text-center text-primary-foreground shadow-elegant sm:px-12">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-primary-foreground/10" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-primary-foreground/10" />
          <Home className="mx-auto h-10 w-10" />
          <h2 className="relative mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-primary-foreground/90">
            {text ?? "Get an instant estimate and book your cleaning online in just a few minutes."}
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="bg-background text-primary hover:bg-background/90">
              <Link to="/book">BOOK NOW</Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <a href={`tel:${(s.phone ?? "").replace(/[^\d+]/g, "")}`}>
                <Phone /> {s.phone}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Wrench };
