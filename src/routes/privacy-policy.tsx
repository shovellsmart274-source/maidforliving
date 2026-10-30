import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | MaidForLiving" },
      { name: "description", content: "How MaidForLiving collects, uses and protects your personal information." },
      { property: "og:title", content: "Privacy Policy | MaidForLiving" },
      { property: "og:description", content: "Our commitment to protecting your privacy." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      sections={[
        ["Information we collect", "When you request a quote, book a cleaning or contact us, we collect details such as your name, email, phone number, address, ZIP code and information about your home."],
        ["How we use it", "We use your information to provide estimates, schedule and deliver cleaning services, communicate with you and improve our services."],
        ["Sharing", "We do not sell your personal information. We only share it with service providers who help us operate our business, or when required by law."],
        ["Security", "We use reasonable technical and organizational safeguards to protect your information."],
        ["Your choices", "You may request access to, correction of, or deletion of your personal information by contacting us."],
        ["Contact", "Questions about this policy? Reach us through our Contact page."],
      ]}
    />
  ),
});

export function LegalPage({ title, sections }: { title: string; sections: [string, string][] }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This is a template document. Please review it with a legal professional before publishing.
        </p>
        <div className="mt-10 space-y-8">
          {sections.map(([h, p]) => (
            <div key={h}>
              <h2 className="text-xl font-bold">{h}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
