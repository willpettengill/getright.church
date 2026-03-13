import Link from "next/link";
import Image from "next/image";
import { cn, endorsementColor, sentimentColor } from "@/lib/utils";
import { EndorsementBadge } from "@/components/ui/badge";
import type { Politician } from "@/lib/types";
import { User } from "lucide-react";

interface PoliticianCardProps {
  politician: Politician;
  className?: string;
}

export function PoliticianCard({ politician, className }: PoliticianCardProps) {
  const sentiment = politician.aggregate_sentiment ?? 0;

  return (
    <Link
      href={`/politicians/${politician.slug}`}
      className={cn(
        "group flex flex-col gap-4 rounded-md border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80",
        className
      )}
    >
      {/* Portrait */}
      <div className="relative aspect-square w-full overflow-hidden rounded bg-secondary">
        {politician.portrait_url ? (
          <Image
            src={politician.portrait_url}
            alt={politician.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User size={48} className="text-muted-foreground/30" />
          </div>
        )}
        {/* Sentiment bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
          <div
            className={cn(
              "h-full transition-all",
              sentiment >= 0 ? "bg-endorsed" : "bg-anti-endorsed"
            )}
            style={{ width: `${Math.min(Math.abs(sentiment), 100)}%` }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5">
        <EndorsementBadge status={politician.endorsement_status} />
        <h3 className="font-sans font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
          {politician.name}
        </h3>
        {politician.title && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {politician.title}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {politician.party && (
            <span className="font-mono text-[10px] text-muted-foreground/60">
              {politician.party}
            </span>
          )}
          <span className="font-mono text-[10px] ml-auto">
            <span className="text-muted-foreground">Sentiment </span>
            <span className={sentimentColor(sentiment)}>
              {sentiment > 0 ? "+" : ""}{Math.round(sentiment)}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
