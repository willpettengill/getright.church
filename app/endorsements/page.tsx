import { createClient } from "@/lib/supabase/server";
import type { Politician } from "@/lib/types";
import { PoliticianCard } from "@/components/politicians/politician-card";
import { TrendingUp, TrendingDown, Eye } from "lucide-react";

export const metadata = {
  title: "Endorsements — Get Right Church",
  description: "Our official endorsements and anti-endorsements.",
};

export default async function EndorsementsPage() {
  const supabase = await createClient();

  const { data: politicians } = await supabase
    .from("politicians")
    .select("*, geography:geographies(*)")
    .in("endorsement_status", ["endorsed", "anti-endorsed", "watching"])
    .order("aggregate_sentiment", { ascending: false });

  const all = (politicians ?? []) as Politician[];
  const endorsed = all.filter((p) => p.endorsement_status === "endorsed");
  const antiEndorsed = all.filter((p) => p.endorsement_status === "anti-endorsed");
  const watching = all.filter((p) => p.endorsement_status === "watching");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-10 border-b border-border pb-6">
        <p className="label-mono mb-2">The Verdict</p>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
          Endorsement Board
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
          This is where we stand. Every politician is either endorsed, anti-endorsed, or under watch. No neutral ground.
        </p>
      </div>

      {/* Endorsed */}
      <EndorsementSection
        title="Endorsed"
        subtitle="These politicians have shown up for the people."
        count={endorsed.length}
        icon={<TrendingUp size={14} className="text-endorsed" />}
        politicians={endorsed}
        borderColor="border-endorsed/20"
      />

      {/* Anti-Endorsed */}
      <EndorsementSection
        title="Anti-Endorsed"
        subtitle="These politicians have failed the people. We vote them out."
        count={antiEndorsed.length}
        icon={<TrendingDown size={14} className="text-anti-endorsed" />}
        politicians={antiEndorsed}
        borderColor="border-anti-endorsed/20"
      />

      {/* Watching */}
      <EndorsementSection
        title="Watching"
        subtitle="The jury is still out. We're tracking their records closely."
        count={watching.length}
        icon={<Eye size={14} className="text-watching" />}
        politicians={watching}
        borderColor="border-watching/20"
      />
    </div>
  );
}

function EndorsementSection({
  title,
  subtitle,
  count,
  icon,
  politicians,
  borderColor,
}: {
  title: string;
  subtitle: string;
  count: number;
  icon: React.ReactNode;
  politicians: Politician[];
  borderColor: string;
}) {
  return (
    <section className={`mb-12 rounded-md border ${borderColor} p-6`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            {icon}
            <h2 className="label-mono text-foreground">{title}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <span className="font-mono text-3xl font-bold text-muted-foreground/30">
          {count}
        </span>
      </div>

      {politicians.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {politicians.map((p) => (
            <PoliticianCard key={p.id} politician={p} />
          ))}
        </div>
      ) : (
        <div className="rounded border border-dashed border-border p-4 text-center">
          <p className="font-mono text-[10px] text-muted-foreground">
            No {title.toLowerCase()} politicians yet.
          </p>
        </div>
      )}
    </section>
  );
}
