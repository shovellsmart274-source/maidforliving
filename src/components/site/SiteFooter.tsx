import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "./Logo";
import { SERVICES } from "@/lib/services-data";
import { useSettings } from "@/hooks/use-public-data";

const QUICK = [
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services" },
  { to: "/pricing", label: "Price Calculator" },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/cleaning-checklist", label: "Cleaning Checklist" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact Us" },
  { to: "/book", label: "Book Online" },
] as const;

export function SiteFooter() {
  const s = useSettings();
  const socials = [
    { href: s.facebook_url, label: "Facebook", Icon: Facebook },
    { href: s.instagram_url, label: "Instagram", Icon: Instagram },
    { href: s.twitter_url, label: "X / Twitter", Icon: Twitter },
  ].filter((x) => x.href);

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo inverted />
          <p className="text-sm leading-relaxed text-ink-foreground/70">
            MaidForLiving delivers professional, reliable and affordable home and office cleaning so you can
            enjoy more of what matters.
          </p>
          <div className="flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-ink-foreground/10 transition-colors hover:bg-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-base font-semibold">Quick Links</h3>
          <ul className="space-y-2.5 text-sm text-ink-foreground/70">
            {QUICK.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-fresh">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-base font-semibold">Cleaning Services</h3>
          <ul className="space-y-2.5 text-sm text-ink-foreground/70">
            {SERVICES.map((svc) => (
              <li key={svc.slug}>
                <Link to="/services/$slug" params={{ slug: svc.slug }} className="transition-colors hover:text-fresh">
                  {svc.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-base font-semibold">Contact</h3>
          <ul className="space-y-4 text-sm text-ink-foreground/70">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-fresh" />
              <a href={`tel:${(s.phone ?? "").replace(/[^\d+]/g, "")}`} className="hover:text-fresh">
                {s.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-fresh" />
              <a href={`mailto:${s.email}`} className="hover:text-fresh">
                {s.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fresh" />
              {s.address}
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-fresh" />
              <span>
                Mon–Fri: {s.hours_weekdays}
                <br />
                Sat: {s.hours_saturday}
                <br />
                Sun: {s.hours_sunday}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} MaidForLiving. All rights reserved. www.maidforliving.com</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-fresh">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-fresh">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
