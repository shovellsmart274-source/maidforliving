import { createFileRoute, Link } from "@tanstack/react-router";
import banner from "@/assets/hero-1.jpg";
import { CtaBanner, PageBanner, SectionHeading } from "@/components/site/sections";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How much does house cleaning cost?",
    a: "Pricing depends on the service, number of bedrooms and bathrooms, home size, frequency and any extras. Use our instant price calculator for an estimate — final pricing is confirmed after we review your details.",
  },
  {
    q: "What services do you offer?",
    a: "Standard house cleaning, deep cleaning, move-in and move-out cleaning, apartment cleaning, office cleaning, green cleaning, after-event cleaning and home organization.",
  },
  { q: "Do I need to provide cleaning supplies?", a: "No. Our team brings professional supplies and equipment. If you prefer specific products, just let us know in your booking notes." },
  { q: "How can I book a cleaning?", a: "Book online in a few minutes using our booking page, or call us. You'll receive a booking ID as soon as your request is submitted." },
  { q: "Do you offer recurring cleaning?", a: "Yes — choose weekly, biweekly or monthly service during booking. Recurring plans include a discount on every visit." },
  {
    q: "What is included in deep cleaning?",
    a: "Everything in a standard cleaning plus baseboards, door frames, light switches, vents, blinds, grout scrubbing, stovetop degreasing and more. See the Deep Cleaning page for the full list.",
  },
  { q: "Can I reschedule my appointment?", a: "Yes. Contact us with your booking ID and we'll help you find a new date and time." },
  { q: "How do I get a free estimate?", a: "Use the instant quote form on our homepage or the price calculator — it's free and takes under a minute." },
  { q: "Which areas do you serve?", a: "Visit our Service Areas page and search your ZIP code to check availability." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | House Cleaning Questions | MaidForLiving" },
      { name: "description", content: "Answers to common questions about MaidForLiving pricing, services, supplies, booking and service areas." },
      { property: "og:title", content: "Frequently Asked Questions | MaidForLiving" },
      { property: "og:description", content: "Everything you need to know before booking your cleaning." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageBanner title="Frequently Asked Questions" subtitle="Quick answers to the questions we hear most." image={banner} crumbs={[{ label: "FAQ" }]} />
      <section className="py-20 sm:py-24">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="Help center" title="Got Questions? We've Got Answers" />
          <Accordion type="single" collapsible defaultValue="f0" className="mt-12 space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className="rounded-2xl border bg-card px-6 shadow-soft data-[state=open]:border-primary/40">
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-10 text-center text-muted-foreground">
            Still have questions?{" "}
            <Link to="/contact" className="font-semibold text-primary underline-offset-4 hover:underline">
              Contact our team
            </Link>
          </p>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
