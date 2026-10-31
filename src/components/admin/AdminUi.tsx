import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {text && <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>{children}</div>;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-star/15 text-foreground",
  new: "bg-star/15 text-foreground",
  confirmed: "bg-sky/20 text-foreground",
  contacted: "bg-sky/20 text-foreground",
  completed: "bg-fresh/20 text-foreground",
  closed: "bg-fresh/20 text-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize", STATUS_STYLES[status] ?? "bg-muted")}>
      {status}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export const smallInput =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30";
