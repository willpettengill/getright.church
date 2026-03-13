import { createClient } from "@/lib/supabase/server";
import { PoliticianCard } from "@/components/politicians/politician-card";
import type { Politician } from "@/lib/types";

interface Props {
  searchParams: Promise<{ status?: string; level?: string; q?: string }>;
}

export const metadata = {
  title: "Politicians — Get Right Church",
  description: "Browse all politicians tracked by Get Right Church.",
};

export default async function PoliticiansPage({ searchParams }: Props) {
  const { status, level, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("politicians")
    .select("*, geography:geographies(*)")
    .order("aggregate_sentiment", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("endorsement_status", status);
  }
  if (level && level !== "all") {
    query = query.eq("geography_level", level);
  }
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const { data: politicians } = await query;

  const allPoliticians = (politicians ?? []) as Politician[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <p className="label-mono mb-2">Database</p>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Politicians
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {allPoliticians.length} politician{allPoliticians.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      {/* Filters */}
      <PoliticianFilters status={status} level={level} q={q} />

      {/* Grid */}
      {allPoliticians.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {allPoliticians.map((p) => (
            <PoliticianCard key={p.id} politician={p} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            No politicians found for these filters.
          </p>
        </div>
      )}
    </div>
  );
}

function PoliticianFilters({
  status,
  level,
  q,
}: {
  status?: string;
  level?: string;
  q?: string;
}) {
  const statuses = [
    { value: "all", label: "All" },
    { value: "endorsed", label: "Endorsed" },
    { value: "anti-endorsed", label: "Anti-Endorsed" },
    { value: "watching", label: "Watching" },
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "federal", label: "Federal" },
    { value: "state", label: "State" },
    { value: "local", label: "Local" },
  ];

  return (
    <form method="GET" className="mb-6 flex flex-wrap items-center gap-3">
      <input
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Search by name..."
        className="rounded border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <div className="flex gap-1">
        {statuses.map((s) => (
          <a
            key={s.value}
            href={`/politicians?status=${s.value}${level ? `&level=${level}` : ""}${q ? `&q=${q}` : ""}`}
            className={`rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              (status === s.value) || (!status && s.value === "all")
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
      <div className="flex gap-1">
        {levels.map((l) => (
          <a
            key={l.value}
            href={`/politicians?level=${l.value}${status ? `&status=${status}` : ""}${q ? `&q=${q}` : ""}`}
            className={`rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              (level === l.value) || (!level && l.value === "all")
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </a>
        ))}
      </div>
    </form>
  );
}
