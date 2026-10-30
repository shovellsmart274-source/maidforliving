import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShieldCheck, CalendarCheck, Leaf } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { Button } from "@/components/ui/button";
import { QuoteForm } from "./QuoteForm";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    image: hero1,
    alt: "Professional MaidForLiving cleaner wiping a marble kitchen island in a bright modern home",
    eyebrow: "Professional Home Cleaning",
    title: "Enjoy a Spotless Home Without the Stress",
  },
  {
    image: hero2,
    alt: "MaidForLiving cleaner vacuuming the floor of an elegant modern living room",
    eyebrow: "Weekly · Biweekly · Monthly",
    title: "Come Home to Fresh, Clean Living Spaces",
  },
  {
    image: hero3,
    alt: "Two MaidForLiving cleaning professionals cleaning a bright modern bathroom",
    eyebrow: "Deep, Move-In & Move-Out Cleaning",
    title: "Detail-Focused Cleaning for Every Room",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6500);
    return () => window.clearInterval(id);
  }, [index]);

  const go = (d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative isolate overflow-hidden bg-ink" aria-roledescription="carousel" aria-label="Featured">
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-1000",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <img
            src={s.image}
            alt={s.alt}
            width={1920}
            height={1088}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className={cn("h-full w-full object-cover object-right", i === index && "animate-ken-burns")}
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
      ))}

      <div className="container-page grid min-h-[calc(100svh-7.5rem)] items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div key={index} className="max-w-2xl text-ink-foreground">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 bg-ink-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-fresh" /> {SLIDES[index].eyebrow}
          </span>
          {index === 0 ? (
            <h1 className="animate-fade-up mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl">
              {SLIDES[index].title}
            </h1>
          ) : (
            <p className="animate-fade-up mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {SLIDES[index].title}
            </p>
          )}
          <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/85 sm:text-lg [animation-delay:120ms]">
            Experience professional, reliable, and affordable cleaning services with MaidForLiving. We take care
            of your home so you can enjoy more of what matters.
          </p>
          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:220ms]">
            <Button asChild variant="hero" size="xl">
              <a href="#quote">GET A FREE QUOTE</a>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/book">BOOK YOUR CLEANING</Link>
            </Button>
          </div>
          <ul className="animate-fade-up mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-ink-foreground/90 [animation-delay:320ms]">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-fresh" /> Experienced professionals
            </li>
            <li className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-fresh" /> Flexible scheduling
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-fresh" /> Green options
            </li>
          </ul>
        </div>

        <div id="quote" className="scroll-mt-28 lg:justify-self-end lg:w-full lg:max-w-md">
          <QuoteForm />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 lg:left-8 lg:translate-x-0">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/30 bg-ink-foreground/10 text-ink-foreground backdrop-blur transition hover:bg-ink-foreground/25"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              i === index ? "w-10 bg-fresh" : "w-2 bg-ink-foreground/50",
            )}
          />
        ))}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/30 bg-ink-foreground/10 text-ink-foreground backdrop-blur transition hover:bg-ink-foreground/25"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
