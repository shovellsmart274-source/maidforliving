import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Search, XCircle } from "lucide-react";
import banner from "@/assets/svc-apartment.jpg";
import { CtaBanner, PageBanner, SectionHeading } from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { fieldInput } from "@/components/site/fields";
import { usePublicData } from "@/hooks/use-public-data";

export const Route = createFileRoute("/service-areas")({
  head: () => ({
    meta: [
      { title: "Service Areas | MaidForLiving Cleaning Near You" },
      { name: "description", content: "Check if MaidForLiving cleaning services are available in your ZIP code and see the cities we serve." },
      { property: "og:title", content: "Service Areas | MaidForLiving" },
      { property: "og:description", content: "Search your ZIP code to check MaidForLiving availability." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/service-areas" }],
  }),
  component: AreasPage,
});

function AreasPage() {
  const { areas } = usePublicData();
  const [zip, setZip] = useState("");
  const [checked, setChecked] = useState<null | { ok: boolean; city?: string }>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    const z = zip.trim();
    if (!/^\d{5}$/.test(z)) return setChecked({ ok: false });
    const hit = areas.find((a) => a.zip_codes.includes(z));
    setChecked(hit ? { ok: true, city: `${hit.city}${hit.state ? ", " + hit.state : ""}` } : { ok: false });
  }

  return (
    <>
      <PageBanner
        title="Our Service Areas"
        subtitle="Search your ZIP code to see if MaidForLiving is available near you."
        image={banner}
        crumbs={[{ label: "Service Areas" }]}
      />
      <section className="-mt-12 pb-10">
        <div className="container-page">
          <form onSubmit={check} className="mx-auto flex max-w-2xl flex-col gap-3 rounded-3xl border bg-card p-4 shadow-card sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                aria-label="ZIP code"
                inputMode="numeric"
                maxLength={5}
                placeholder="Enter your ZIP code"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, ""));
                  setChecked(null);
                }}
                className={`${fieldInput} pl-12`}
              />
            </div>
            <Button type="submit" variant="hero" size="lg">
              Check Availability
            </Button>
          </form>
          {checked && (
            <div className="mx-auto mt-5 max-w-2xl rounded-2xl border bg-card p-5 text-center shadow-soft" role="status">
              {checked.ok ? (
                <p className="flex items-center justify-center gap-2 font-semibold text-primary">
                  <CheckCircle2 className="h-5 w-5 text-fresh" /> Great news — we serve {checked.city}!{" "}
                  <Link to="/book" search={{ zip }} className="underline">
                    Book now
                  </Link>
                </p>
              ) : (
                <p className="flex flex-wrap items-center justify-center gap-2 font-semibold">
                  <XCircle className="h-5 w-5 text-destructive" /> We don't list that ZIP yet.{" "}
                  <Link to="/contact" className="text-primary underline">
                    Contact us
                  </Link>{" "}
                  — we may still be able to help.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Locations" title="Cities & Communities We Serve" />
          {areas.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">Service areas will be listed here soon.</p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((a) => (
                <article key={a.id} className="card-lift rounded-3xl border bg-card p-7 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary">
                      <MapPin className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{a.city}</h3>
                      {a.state && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{a.state}</p>}
                    </div>
                  </div>
                  {a.description && <p className="mt-4 text-sm text-muted-foreground">{a.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {a.zip_codes.map((z) => (
                      <span key={z} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                        {z}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-fresh">
                    <CheckCircle2 className="h-4 w-4" /> Service available
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaBanner title="Don't See Your Area?" text="Get in touch — we're always expanding and may be able to schedule a visit." />
    </>
  );
}
