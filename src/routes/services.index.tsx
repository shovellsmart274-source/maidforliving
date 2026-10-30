import { createFileRoute } from "@tanstack/react-router";
import banner from "@/assets/hero-3.jpg";
import { CtaBanner, HowItWorks, PageBanner, SectionHeading, ServicesGrid } from "@/components/site/sections";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Cleaning Services | MaidForLiving" },
      {
        name: "description",
        content:
          "Standard, deep, move-in, move-out, apartment, office, green, after-event cleaning and home organization from MaidForLiving.",
      },
      { property: "og:title", content: "Our Cleaning Services | MaidForLiving" },
      { property: "og:description", content: "Explore every MaidForLiving cleaning service and book online." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageBanner
        title="Our Cleaning Services"
        subtitle="Professional cleaning solutions for every home, apartment and office."
        image={banner}
        crumbs={[{ label: "Services" }]}
      />
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we offer"
            title="Find the Right Clean for Your Space"
            text="Every service follows a detailed checklist and can be customized with add-ons."
          />
          <div className="mt-14">
            <ServicesGrid />
          </div>
        </div>
      </section>
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
