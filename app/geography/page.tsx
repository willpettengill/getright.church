import { createClient } from "@/lib/supabase/server";
import type { Geography, Politician } from "@/lib/types";
import { PoliticianCard } from "@/components/politicians/politician-card";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Geography — Get Right Church",
  description: "Browse politicians by geography.",
};

export default async function GeographyPage() {
  const supabase = await createClient();

  const [{ data: geographies }, { data: politicians }] = await Promise.all([
    supabase.from("geographies").select("*").order("type").order("name"),
    supabase
      .from("politicians")
      .select("*, geography:geographies(*)")
      .order("aggregate_sentiment", { ascending: false }),
  ]);

  const allGeos = (geographies ?? []) as Geography[];
  const allPols = (politicians ?? []) as Politician[];

  const federal = allGeos.filter((g) => g.type === "federal");
  const states = allGeos.filter((g) => g.type === "state");
  const local = allGeos.filter((g) => g.type === "local");

  function getPoliticiansForGeo(geoId: string) {
    return allPols.filter((p) => p.geography_id === geoId);
  }

  function getUnassigned() {
    return allPols.filter((p) => !p.geography_id);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-10 border-b border-border pb-6">
        <p className="label-mono mb-2">By Location</p>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Geography
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Find politicians by their jurisdiction — federal, state, or local.
        </p>
      </div>

      {/* Federal */}
      {federal.length > 0 && (
        <GeoSection
          label="Federal"
          geographies={federal}
          getPoliticians={getPoliticiansForGeo}
        />
      )}

      {/* States */}
      {states.length > 0 && (
        <GeoSection
          label="State"
          geographies={states}
          getPoliticians={getPoliticiansForGeo}
        />
      )}

      {/* Local */}
      {local.length > 0 && (
        <GeoSection
          label="Local"
          geographies={local}
          getPoliticians={getPoliticiansForGeo}
        />
      )}

      {/* Unassigned */}
      {getUnassigned().length > 0 && (
        <section className="mb-10">
          <h2 className="label-mono mb-4 text-foreground">Unassigned</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {getUnassigned().map((p) => (
              <PoliticianCard key={p.id} politician={p} />
            ))}
          </div>
        </section>
      )}

      {allPols.length === 0 && (
        <div className="rounded border border-dashed border-border p-8 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            No politicians in the database yet. Add them via the admin panel.
          </p>
        </div>
      )}
    </div>
  );
}

function GeoSection({
  label,
  geographies,
  getPoliticians,
}: {
  label: string;
  geographies: Geography[];
  getPoliticians: (id: string) => Politician[];
}) {
  return (
    <section className="mb-10">
      <h2 className="label-mono mb-5 text-foreground">{label}</h2>
      <div className="flex flex-col gap-6">
        {geographies.map((geo) => {
          const pols = getPoliticians(geo.id);
          return (
            <div key={geo.id} className="rounded-md border border-border bg-card p-4">
              <div className="mb-4 flex items-center gap-2">
                <MapPin size={12} className="text-primary" />
                <h3 className="font-sans font-semibold text-foreground text-sm">{geo.name}</h3>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">
                  {pols.length} politician{pols.length !== 1 ? "s" : ""}
                </span>
              </div>
              {pols.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {pols.map((p) => (
                    <PoliticianCard key={p.id} politician={p} />
                  ))}
                </div>
              ) : (
                <p className="font-mono text-[10px] text-muted-foreground/50">
                  No politicians assigned to this geography.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
