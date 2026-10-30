import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Phone, Sparkles } from "lucide-react";
import { getServiceContent, SERVICES } from "@/lib/services-data";
import { CtaBanner, PageBanner, SectionHeading } from "@/components/site/sections";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { usePublicData, useSettings } from "@/hooks/use-public-data";
import { formatUSD } from "@/lib/pricing";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getServiceContent(params.slug);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? getServiceContent(loaderData.slug) : undefined;
    if (!s) return { meta: [{ title: "Service not found | MaidForLiving" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${s.name} | MaidForLiving` },
        { name: "description", content: `${s.tagline} ${s.short}` },
        { property: "og:title", content: `${s.name} | MaidForLiving` },
        { property: "og:description", content: s.tagline },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `https://www.maidforliving.com/services/${s.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: s.name,
            description: s.short,
            provider: { "@type": "HouseCleaningService", name: "MaidForLiving", url: "https://www.maidforliving.com" },
          }),
        },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const s = getServiceContent(slug)!;
  const { services } = usePublicData();
  const settings = useSettings();
  const db = services.find((x) => x.slug === slug);
  const others = SERVICES.filter((x) => x.slug !== slug).slice(0, 4);

  return (
    <>
      <PageBanner
        title={db?.name ?? s.name}
        subtitle={s.tagline}
        image={s.image}
        crumbs={[{ label: "Services", to: "/services" }, { label: db?.name ?? s.name }]}
      />

      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <SectionHeading align="left" eyebrow="Service overview" title={`About Our ${db?.name ?? s.name}`} />
            {s.intro.map((p) => (
              <p key={p} className="mt-5 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            <img
              src={s.image}
              alt={`${s.name} in progress`}
              width={1200}
              height={800}
              loading="lazy"
              className="mt-10 aspect-[16/9] w-full rounded-[2rem] object-cover shadow-card"
            />

            <h2 className="mt-14 text-2xl font-bold sm:text-3xl">Benefits</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {s.benefits.map((b) => (
                <div key={b.title} className="rounded-3xl border bg-card p-6 shadow-soft">
                  <Sparkles className="h-7 w-7 text-fresh" />
                  <h3 className="mt-3 font-bold">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{b.text}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-14 text-2xl font-bold sm:text-3xl">What's Included</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {s.checklist.map((c) => (
                <li key={c} className="flex items-start gap-3 rounded-2xl bg-muted px-4 py-3 text-sm font-medium">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {c}
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="mt-6 space-y-3">
              {s.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`f${i}`} className="rounded-2xl border bg-card px-5">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-3xl bg-ink p-7 text-ink-foreground shadow-card">
              <p className="text-sm font-semibold uppercase tracking-wider text-fresh">Starting from</p>
              <p className="mt-1 font-display text-5xl font-bold">{formatUSD(db?.base_price ?? 0)}</p>
              <p className="mt-2 text-sm text-ink-foreground/70">Final price depends on your home's size and extras.</p>
              <Button asChild variant="hero" size="lg" className="mt-6 w-full">
                <Link to="/book" search={{ service: slug }}>
                  BOOK {(db?.name ?? s.name).toUpperCase()}
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg" className="mt-3 w-full">
                <a href={`tel:${(settings.phone ?? "").replace(/[^\d+]/g, "")}`}>
                  <Phone /> {settings.phone}
                </a>
              </Button>
            </div>
            <div className="rounded-3xl border bg-card p-6 shadow-soft">
              <h3 className="font-bold">Other Services</h3>
              <ul className="mt-4 space-y-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: o.slug }}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-accent hover:text-primary"
                    >
                      {o.name} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <CtaBanner title={`Book Your ${db?.name ?? s.name} Today`} />
    </>
  );
}
