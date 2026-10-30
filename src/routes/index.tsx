import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/site/HeroSlider";
import {
  AboutTeaser,
  CtaBanner,
  HowItWorks,
  SectionHeading,
  ServicesGrid,
  Testimonials,
  TrustSection,
  WhyChoose,
} from "@/components/site/sections";
import { PriceCalculator } from "@/components/site/PriceCalculator";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MaidForLiving | Professional House Cleaning Services — Book Online" },
      {
        name: "description",
        content:
          "Enjoy a spotless home without the stress. Standard, deep, move-in/out, apartment, office and green cleaning. Instant quote & online booking.",
      },
      { property: "og:title", content: "MaidForLiving | Professional House Cleaning Services" },
      {
        property: "og:description",
        content: "Professional, reliable, and affordable cleaning services. Get your free quote in 60 seconds.",
      },
      { property: "og:url", content: "https://www.maidforliving.com/" },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HouseCleaningService",
          name: "MaidForLiving",
          url: "https://www.maidforliving.com",
          description:
            "Professional, reliable, and affordable house cleaning services including standard, deep, move-in, move-out, apartment, office and green cleaning.",
          priceRange: "$$",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSlider />
      <TrustSection />
      <HowItWorks />
      <AboutTeaser />
      <section className="bg-muted py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our services"
            title="Our Cleaning Services"
            text="Whatever your home needs, we have a cleaning service designed around it."
          />
          <div className="mt-14">
            <ServicesGrid />
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">
                View All Services <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <WhyChoose />
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Instant price calculator"
            title="See Your Price in Seconds"
            text="Adjust your home details and extras to get an instant estimate."
          />
          <div className="mt-12">
            <PriceCalculator />
          </div>
        </div>
      </section>
      <Testimonials />
      <CtaBanner />
    </>
  );
}
