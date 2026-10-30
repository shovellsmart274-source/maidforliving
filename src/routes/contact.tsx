import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Clock, Facebook, Instagram, Loader2, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { toast } from "sonner";
import banner from "@/assets/svc-office.jpg";
import { PageBanner } from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { FieldLabel, fieldInput, NativeSelect } from "@/components/site/fields";
import { usePublicData } from "@/hooks/use-public-data";
import { submitContact } from "@/lib/public-data.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | MaidForLiving Cleaning Services" },
      { name: "description", content: "Contact MaidForLiving for questions, quotes and bookings. Call, email or send us a message." },
      { property: "og:title", content: "Contact MaidForLiving" },
      { property: "og:description", content: "We're here to help — reach out to our friendly team." },
    ],
    links: [{ rel: "canonical", href: "https://www.maidforliving.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { services, settings: s } = usePublicData();
  const send = useServerFn(submitContact);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await send({ data: form });
      setSent(true);
      toast.success("Message sent! We'll be in touch soon.");
    } catch {
      toast.error("Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  const info = [
    { Icon: Phone, label: "Call us", value: s.phone, href: `tel:${(s.phone ?? "").replace(/[^\d+]/g, "")}` },
    { Icon: Mail, label: "Email us", value: s.email, href: `mailto:${s.email}` },
    { Icon: MapPin, label: "Address", value: s.address },
  ];

  return (
    <>
      <PageBanner title="Contact Us" subtitle="Questions, quotes or special requests — we're happy to help." image={banner} crumbs={[{ label: "Contact Us" }]} />
      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            {info.map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 rounded-3xl border bg-card p-6 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-fresh text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block font-bold hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 font-bold">{value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-3xl bg-ink p-6 text-ink-foreground shadow-card">
              <p className="flex items-center gap-2 font-bold">
                <Clock className="h-5 w-5 text-fresh" /> Business Hours
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-ink-foreground/70">Monday – Friday</dt><dd>{s.hours_weekdays}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-foreground/70">Saturday</dt><dd>{s.hours_saturday}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-foreground/70">Sunday</dt><dd>{s.hours_sunday}</dd></div>
              </dl>
              <div className="mt-5 flex gap-3">
                {[
                  { href: s.facebook_url, Icon: Facebook, label: "Facebook" },
                  { href: s.instagram_url, Icon: Instagram, label: "Instagram" },
                  { href: s.twitter_url, Icon: Twitter, label: "X / Twitter" },
                ]
                  .filter((x) => x.href)
                  .map(({ href, Icon, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full bg-ink-foreground/10 hover:bg-primary">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-9">
            {sent ? (
              <div className="py-16 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-fresh" />
                <h2 className="mt-4 text-2xl font-bold">Thank you!</h2>
                <p className="mt-2 text-muted-foreground">Your message has been received. Our team will reply shortly.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSent(false); setForm({ fullName: "", email: "", phone: "", service: "", message: "" }); }}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-2xl font-bold">Send Us a Message</h2>
                  <p className="mt-1 text-sm text-muted-foreground">We usually reply within one business day.</p>
                </div>
                <div>
                  <FieldLabel htmlFor="c-name">Full Name</FieldLabel>
                  <input id="c-name" required minLength={2} value={form.fullName} onChange={set("fullName")} className={fieldInput} />
                </div>
                <div>
                  <FieldLabel htmlFor="c-email">Email</FieldLabel>
                  <input id="c-email" type="email" required value={form.email} onChange={set("email")} className={fieldInput} />
                </div>
                <div>
                  <FieldLabel htmlFor="c-phone">Phone</FieldLabel>
                  <input id="c-phone" type="tel" value={form.phone} onChange={set("phone")} className={fieldInput} />
                </div>
                <div>
                  <FieldLabel htmlFor="c-svc">Service Required</FieldLabel>
                  <NativeSelect id="c-svc" value={form.service} onChange={set("service")}>
                    <option value="">Select a service</option>
                    {services.map((x) => (
                      <option key={x.slug} value={x.name}>{x.name}</option>
                    ))}
                    <option value="Other">Other</option>
                  </NativeSelect>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="c-msg">Message</FieldLabel>
                  <textarea id="c-msg" required minLength={5} rows={5} value={form.message} onChange={set("message")} className={`${fieldInput} h-auto py-3`} />
                </div>
                <Button type="submit" variant="hero" size="lg" className="sm:col-span-2" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" />} SEND MESSAGE
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="container-page">
          <div className="grid h-80 place-items-center rounded-[2rem] border-2 border-dashed border-primary/30 bg-gradient-soft text-center">
            <div>
              <MapPin className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 font-bold">Google Map</p>
              <p className="text-sm text-muted-foreground">Map placeholder — add your business location to display a map here.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
