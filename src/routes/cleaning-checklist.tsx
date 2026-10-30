import { createFileRoute } from "@tanstack/react-router";
import { Bath, BedDouble, CheckCircle2, CookingPot, Sofa } from "lucide-react";
import banner from "@/assets/svc-deep.jpg";
import { CtaBanner, PageBanner, SectionHeading } from "@/components/site/sections";

export const Route = createFileRoute("/cleaning-checklist")({
  head: () => ({
    meta: [
      { title: "Cleaning Checklist | What's Included | MaidForLiving" },
      { name: "description", content: "See exactly what MaidForLiving cleans in your kitchen, bathrooms, bedrooms and living areas." },
      { property: "og:title", content: "MaidForLiving Cleaning Checklist" },
      { property: "og:description", content: "Room-by-room checklist for every MaidForLiving cleaning." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/cleaning-checklist" }],
  }),
  component: ChecklistPage,
});

const ROOMS = [
  {
    Icon: CookingPot,
    name: "Kitchen",
    items: ["Clean countertops", "Clean sink", "Clean appliance exteriors", "Clean cabinet exteriors", "Clean floors", "Empty trash"],
  },
  {
    Icon: Bath,
    name: "Bathrooms",
    items: ["Clean toilets", "Clean showers and bathtubs", "Clean mirrors", "Clean sinks", "Clean countertops", "Clean floors"],
  },
  { Icon: BedDouble, name: "Bedrooms", items: ["Dust furniture", "Make beds", "Clean surfaces", "Vacuum carpets", "Clean floors"] },
  { Icon: Sofa, name: "Living Areas", items: ["Dust furniture", "Clean tables", "Vacuum carpets", "Mop floors", "Empty trash"] },
];

function ChecklistPage() {
  return (
    <>
      <PageBanner
        title="Our Cleaning Checklist"
        subtitle="A clear, room-by-room look at everything included in your cleaning."
        image={banner}
        crumbs={[{ label: "Cleaning Checklist" }]}
      />
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Room by room"
            title="Every Room, Every Detail"
            text="Our cleaners follow this checklist on every standard visit. Deep cleaning and add-ons go even further."
          />
          <div className="mt-14 grid gap-7 md:grid-cols-2">
            {ROOMS.map(({ Icon, name, items }) => (
              <div key={name} className="card-lift overflow-hidden rounded-3xl border bg-card shadow-soft">
                <div className="flex items-center gap-4 bg-gradient-fresh px-7 py-5 text-primary-foreground">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-foreground/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <span className="ml-auto rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-bold">{items.length} tasks</span>
                </div>
                <ul className="grid gap-1 p-5 sm:grid-cols-2">
                  {items.map((it) => (
                    <li key={it} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-fresh" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
