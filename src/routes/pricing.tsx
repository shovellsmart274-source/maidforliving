import { createFileRoute } from "@tanstack/react-router";
import banner from "@/assets/svc-standard.jpg";
import { CtaBanner, PageBanner, SectionHeading } from "@/components/site/sections";
import { PriceCalculator } from "@/components/site/PriceCalculator";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Instant Cleaning Price Calculator | MaidForLiving" },
      { name: "description", content: "Calculate your house cleaning price instantly based on bedrooms, bathrooms, size, cleaning type, frequency and extras." },
      { property: "og:title", content: "Cleaning Price Calculator | MaidForLiving" },
      { property: "og:description", content: "Get an instant cleaning estimate in seconds." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/pricing" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <PageBanner title="Instant Price Calculator" subtitle="Transparent pricing — see your estimate before you book." image={banner} crumbs={[{ label: "Pricing" }]} />
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Build your clean" title="Customize & See Your Price" text="Save more with weekly, biweekly or monthly plans." />
          <div className="mt-12">
            <PriceCalculator />
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
