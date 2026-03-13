import { createClient } from "@/lib/supabase/server";
import { PulseCard } from "@/components/pulse/pulse-card";
import { PoliticianCard } from "@/components/politicians/politician-card";
import type { Post, Politician } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Eye } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: posts }, { data: politicians }] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("politicians")
      .select("*, geography:geographies(*)")
      .order("aggregate_sentiment", { ascending: false })
      .limit(8),
  ]);

  const endorsed = politicians?.filter((p) => p.endorsement_status === "endorsed") ?? [];
  const antiEndorsed = politicians?.filter((p) => p.endorsement_status === "anti-endorsed") ?? [];
  const watching = politicians?.filter((p) => p.endorsement_status === "watching") ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Hero */}
      <section className="mb-10 border-b border-border pb-8">
        <p className="label-mono mb-3">Political Accountability</p>
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
          Know who&apos;s right.
          <br />
          <span className="text-primary">Hold the rest accountable.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed">
          We track politicians&apos; records, votes, and public sentiment so you never have to take their word for it. Endorsed, Anti-Endorsed, or Watching — we make the call.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/politicians"
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse Politicians <ArrowRight size={12} />
          </Link>
          <Link
            href="/endorsements"
            className="flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            Endorsement List
          </Link>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mb-10 grid grid-cols-3 gap-4 border-b border-border pb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-endorsed" />
            <span className="label-mono">Endorsed</span>
          </div>
          <span className="font-mono text-2xl font-bold text-endorsed">{endorsed.length}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <TrendingDown size={14} className="text-anti-endorsed" />
            <span className="label-mono">Anti-Endorsed</span>
          </div>
          <span className="font-mono text-2xl font-bold text-anti-endorsed">{antiEndorsed.length}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-watching" />
            <span className="label-mono">Watching</span>
          </div>
          <span className="font-mono text-2xl font-bold text-watching">{watching.length}</span>
        </div>
      </section>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Pulse Feed — left 2 cols */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="label-mono text-foreground">The Pulse</h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              Latest {posts?.length ?? 0} posts
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {posts && posts.length > 0 ? (
              (posts as Post[]).map((post) => (
                <PulseCard key={post.id} post={post} />
              ))
            ) : (
              <div className="rounded-md border border-dashed border-border p-8 text-center">
                <p className="font-mono text-xs text-muted-foreground">No posts yet. Add content via the admin panel.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Politicians — right 1 col */}
        <section className="lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="label-mono text-foreground">Politicians</h2>
            <Link href="/politicians" className="font-mono text-[10px] text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {politicians && (politicians as Politician[]).slice(0, 4).map((p) => (
              <PoliticianCard key={p.id} politician={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
