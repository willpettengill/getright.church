import { createClient } from "@/lib/supabase/server";
import type { Politician, Geography } from "@/lib/types";
import { EndorsementBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";

export const metadata = { title: "Politicians Admin — Get Right Church" };

export default async function AdminPoliticiansPage() {
  const supabase = await createClient();

  const [{ data: politicians }, { data: geographies }] = await Promise.all([
    supabase
      .from("politicians")
      .select("*, geography:geographies(*)")
      .order("created_at", { ascending: false }),
    supabase.from("geographies").select("*").order("name"),
  ]);

  const allPols = (politicians ?? []) as Politician[];
  const allGeos = (geographies ?? []) as Geography[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="label-mono mb-1">Admin</p>
          <h1 className="font-sans text-2xl font-bold text-foreground">Politicians</h1>
        </div>
        <Link
          href="/admin/politicians/new"
          className="flex items-center gap-1.5 rounded bg-primary px-3 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus size={12} />
          Add Politician
        </Link>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left label-mono">Name</th>
              <th className="px-4 py-3 text-left label-mono">Status</th>
              <th className="px-4 py-3 text-left label-mono">Level</th>
              <th className="px-4 py-3 text-left label-mono">Sentiment</th>
              <th className="px-4 py-3 text-left label-mono">Added</th>
              <th className="px-4 py-3 text-left label-mono">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allPols.map((pol) => (
              <tr key={pol.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{pol.name}</p>
                    {pol.title && (
                      <p className="font-mono text-[10px] text-muted-foreground">{pol.title}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <EndorsementBadge status={pol.endorsement_status} />
                </td>
                <td className="px-4 py-3">
                  <span className="label-mono">{pol.geography_level ?? "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-mono text-xs ${
                    pol.aggregate_sentiment >= 0 ? "text-endorsed" : "text-anti-endorsed"
                  }`}>
                    {pol.aggregate_sentiment > 0 ? "+" : ""}{Math.round(pol.aggregate_sentiment)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                  {formatDate(pol.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/politicians/${pol.id}/edit`}
                      className="font-mono text-[10px] text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/politicians/${pol.slug}`}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink size={10} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allPols.length === 0 && (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">No politicians yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
