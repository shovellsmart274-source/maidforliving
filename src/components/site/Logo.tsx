import { Link } from "@tanstack/react-router";
import { Home, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="MaidForLiving home">
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-fresh text-primary-foreground shadow-elegant transition-transform duration-300 group-hover:rotate-6">
        <Home className="h-5 w-5" strokeWidth={2.4} />
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-fresh" fill="currentColor" />
      </span>
      <span
        className={cn(
          "font-display text-xl font-bold tracking-tight",
          inverted ? "text-ink-foreground" : "text-foreground",
        )}
      >
        MaidFor<span className={inverted ? "text-fresh" : "text-primary"}>Living</span>
      </span>
    </Link>
  );
}
