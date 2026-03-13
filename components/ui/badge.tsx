import { cn } from "@/lib/utils";
import type { EndorsementStatus } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "endorsed" | "anti-endorsed" | "watching";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest rounded border",
        variant === "default" && "bg-secondary text-secondary-foreground border-border",
        variant === "outline" && "bg-transparent border-border text-muted-foreground",
        variant === "endorsed" && "bg-endorsed/10 text-endorsed border-endorsed/30",
        variant === "anti-endorsed" && "bg-anti-endorsed/10 text-anti-endorsed border-anti-endorsed/30",
        variant === "watching" && "bg-watching/10 text-watching border-watching/30",
        className
      )}
    >
      {children}
    </span>
  );
}

export function EndorsementBadge({ status }: { status: EndorsementStatus }) {
  const labels: Record<EndorsementStatus, string> = {
    endorsed: "Endorsed",
    "anti-endorsed": "Anti-Endorsed",
    watching: "Watching",
  };
  return <Badge variant={status}>{labels[status]}</Badge>;
}
