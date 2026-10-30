import { createFileRoute } from "@tanstack/react-router";
import { Eye, HeartHandshake, Leaf, ShieldCheck, Target } from "lucide-react";
import banner from "@/assets/hero-2.jpg";
import { AboutTeaser, CtaBanner, HowItWorks, PageBanner, SectionHeading, Testimonials, WhyChoose } from "@/components/site/sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | MaidForLiving Professional Cleaning" },
      {
        name: "description",
        content: "Learn about MaidForLiving — our commitment to professional cleaning, quality, reliability and customer satisfaction.",
      },
      { property: "og:title", content: "About MaidForLiving" },
      { property: "og:description", content: "Your trusted partner for a cleaner, healthier home." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  { Icon: ShieldCheck, title: "Reliability", text: "We show up on time and deliver consistent results." },
  { Icon: HeartHandshake, title: "Respect", text: "We treat every home as if it were our own." },
  { Icon: Target, title: "Quality", text: "Detailed checklists guide every single visit." },
  { Icon: Leaf, title: "Responsibility", text: "Eco-conscious options for healthier living." },
];

function AboutPage() {
  return (
    <>
      <PageBanner
        title="About MaidForLiving"
        subtitle="Professional cleaning built on care, consistency and attention to detail."
        image={banner}
        crumbs={[{ label: "About Us" }]}
      />
      <AboutTeaser showButton={false} />
      <section className="bg-muted py-20 sm:py-24">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-card p-8 shadow-soft">
            <Target className="h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              To give every customer a cleaner, calmer home through dependable service, honest pricing and a
              team that genuinely cares about the details.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-8 shadow-soft">
            <Eye className="h-10 w-10 text-fresh" />
            <h2 className="mt-4 text-2xl font-bold">Our Vision</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              To be the most trusted name in home cleaning — known for quality work, easy booking and
              exceptional customer experiences.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Our values" title="What We Stand For" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, title, text }) => (
              <div key={title} className="card-lift rounded-3xl border bg-card p-7 text-center shadow-soft">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-fresh text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
