import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Clock, Mail, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SERVICES } from "@/lib/services-data";
import { useSettings } from "@/hooks/use-public-data";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services", dropdown: true },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/cleaning-checklist", label: "Cleaning Checklist" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function SiteHeader() {
  const settings = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const phone = settings.phone || "(555) 000-0000";
  const tel = `tel:${phone.replace(/[^\d+]/g, "")}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="hidden bg-ink text-ink-foreground md:block">
        <div className="container-page flex h-10 items-center justify-between text-xs">
          <p className="opacity-90">{settings.announcement}</p>
          <div className="flex items-center gap-6 opacity-90">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-fresh" /> Mon–Fri {settings.hours_weekdays}
            </span>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-fresh">
              <Mail className="h-3.5 w-3.5 text-fresh" /> {settings.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl transition-all duration-300",
          scrolled ? "border-border shadow-soft" : "border-transparent",
        )}
      >
        <div className="container-page flex h-20 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
            {NAV.map((item) =>
              "dropdown" in item ? (
                <div key={item.to} className="group relative">
                  <Link
                    to="/services"
                    className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
                    activeProps={{ className: "text-primary" }}
                  >
                    Services <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-3xl border bg-popover p-3 shadow-card">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to="/services/$slug"
                          params={{ slug: s.slug }}
                          className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-accent"
                        >
                          <img src={s.image} alt="" className="h-11 w-11 rounded-xl object-cover" loading="lazy" />
                          <span>
                            <span className="block text-sm font-semibold text-foreground">{s.name}</span>
                            <span className="line-clamp-1 text-xs text-muted-foreground">{s.short}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a href={tel} className="hidden items-center gap-2 lg:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-primary">
                <Phone className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Call us
                </span>
                <span className="block text-sm font-bold text-foreground">{phone}</span>
              </span>
            </a>
            <Button asChild variant="hero" className="hidden sm:inline-flex">
              <Link to="/book">BOOK NOW</Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm overflow-y-auto p-0 [&>button]:hidden">
                <div className="flex items-center justify-between border-b p-5">
                  <SheetTitle asChild>
                    <div>
                      <Logo />
                    </div>
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col p-4" aria-label="Mobile">
                  {NAV.map((item) =>
                    "dropdown" in item ? (
                      <div key={item.to}>
                        <button
                          type="button"
                          onClick={() => setMobileServices((v) => !v)}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-semibold hover:bg-accent"
                          aria-expanded={mobileServices}
                        >
                          Services
                          <ChevronDown className={cn("h-4 w-4 transition-transform", mobileServices && "rotate-180")} />
                        </button>
                        {mobileServices && (
                          <div className="ml-4 flex flex-col border-l pl-3">
                            <SheetClose asChild>
                              <Link to="/services" className="rounded-xl px-3 py-2 text-sm font-semibold text-primary">
                                All Services
                              </Link>
                            </SheetClose>
                            {SERVICES.map((s) => (
                              <SheetClose asChild key={s.slug}>
                                <Link
                                  to="/services/$slug"
                                  params={{ slug: s.slug }}
                                  className="rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-accent"
                                >
                                  {s.name}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <SheetClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          activeOptions={{ exact: item.to === "/" }}
                          className="rounded-2xl px-4 py-3 font-semibold hover:bg-accent"
                          activeProps={{ className: "text-primary bg-accent" }}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ),
                  )}
                </nav>
                <div className="space-y-3 border-t p-5">
                  <a href={tel} className="flex items-center gap-3 font-bold">
                    <Phone className="h-4 w-4 text-primary" /> {phone}
                  </a>
                  <SheetClose asChild>
                    <Button asChild variant="hero" size="lg" className="w-full">
                      <Link to="/book">BOOK NOW</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
