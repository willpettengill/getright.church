import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EndorsementBadge } from "@/components/ui/badge";
import { cn, formatDate, sentimentColor, sentimentLabel } from "@/lib/utils";
import type { Vote, Post, Comment } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { User, ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PulseCard } from "@/components/pulse/pulse-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("politicians")
    .select("name, bio")
    .eq("slug", slug)
    .single();
  if (!data) return { title: "Politician Not Found" };
  return {
    title: `${data.name} — Get Right Church`,
    description: data.bio ?? `Track ${data.name}'s record on Get Right Church.`,
  };
}

export default async function PoliticianProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: politician } = await supabase
    .from("politicians")
    .select("*, geography:geographies(*)")
    .eq("slug", slug)
    .single();

  if (!politician) notFound();

  const [{ data: votes }, { data: posts }, { data: comments }] = await Promise.all([
    supabase
      .from("votes")
      .select("*")
      .eq("politician_id", politician.id)
      .order("vote_date", { ascending: false }),
    supabase
      .from("posts")
      .select("*")
      .contains("politician_ids", [politician.id])
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("comments")
      .select("*, user:users(username)")
      .eq("politician_id", politician.id)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const sentiment = politician.aggregate_sentiment ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Back */}
      <Link
        href="/politicians"
        className="mb-6 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={10} />
        All Politicians
      </Link>

      {/* Profile Header */}
      <div className="mb-8 grid gap-6 border-b border-border pb-8 md:grid-cols-[200px_1fr]">
        {/* Portrait */}
        <div className="relative h-48 w-48 overflow-hidden rounded-md bg-secondary md:h-full md:w-full">
          {politician.portrait_url ? (
            <Image
              src={politician.portrait_url}
              alt={politician.name}
              fill
              className="object-cover"
              sizes="200px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <User size={64} className="text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start gap-3">
            <EndorsementBadge status={politician.endorsement_status} />
            {politician.geography_level && (
              <span className="label-mono">{politician.geography_level}</span>
            )}
          </div>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            {politician.name}
          </h1>
          <div className="flex flex-wrap gap-4">
            {politician.title && (
              <div>
                <p className="label-mono">Title</p>
                <p className="mt-0.5 text-sm text-foreground">{politician.title}</p>
              </div>
            )}
            {politician.party && (
              <div>
                <p className="label-mono">Party</p>
                <p className="mt-0.5 text-sm text-foreground">{politician.party}</p>
              </div>
            )}
            {politician.office_held && (
              <div>
                <p className="label-mono">Office</p>
                <p className="mt-0.5 text-sm text-foreground">{politician.office_held}</p>
              </div>
            )}
            {politician.years_in_office && (
              <div>
                <p className="label-mono">Years in Office</p>
                <p className="mt-0.5 text-sm text-foreground">{politician.years_in_office}</p>
              </div>
            )}
          </div>

          {/* Sentiment meter */}
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between">
              <p className="label-mono">Public Sentiment</p>
              <span className={cn("font-mono text-xs font-bold", sentimentColor(sentiment))}>
                {sentimentLabel(sentiment)} ({sentiment > 0 ? "+" : ""}{Math.round(sentiment)})
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  sentiment >= 0 ? "bg-endorsed" : "bg-anti-endorsed"
                )}
                style={{ width: `${Math.min(Math.abs(sentiment), 100)}%` }}
              />
            </div>
          </div>

          {politician.bio && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {politician.bio}
            </p>
          )}
        </div>
      </div>

      {/* Tabs: The Record, The Talk, The Pulse, The Network */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* The Record — Voting History */}
        <section>
          <h2 className="label-mono mb-4 text-foreground">The Record</h2>
          {votes && votes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {(votes as Vote[]).map((vote) => (
                <div
                  key={vote.id}
                  className="flex items-start justify-between gap-3 rounded border border-border bg-card p-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-foreground">{vote.bill_name}</p>
                    <div className="flex items-center gap-2">
                      {vote.bill_id && (
                        <span className="font-mono text-[10px] text-muted-foreground/60">{vote.bill_id}</span>
                      )}
                      {vote.policy_category && (
                        <span className="label-mono">{vote.policy_category}</span>
                      )}
                    </div>
                    {vote.vote_date && (
                      <span className="font-mono text-[10px] text-muted-foreground/50">
                        {formatDate(vote.vote_date)}
                      </span>
                    )}
                  </div>
                  <VoteResultBadge result={vote.vote_result} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No voting records yet." />
          )}
        </section>

        {/* The Pulse — Social Feed */}
        <section>
          <h2 className="label-mono mb-4 text-foreground">The Pulse</h2>
          {posts && posts.length > 0 ? (
            <div className="flex flex-col gap-3">
              {(posts as Post[]).map((post) => (
                <PulseCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState message="No posts linked to this politician yet." />
          )}
        </section>

        {/* The Talk — Comments */}
        <section className="lg:col-span-2">
          <h2 className="label-mono mb-4 text-foreground">The Talk</h2>
          {comments && comments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {(comments as Comment[]).map((comment) => (
                <div
                  key={comment.id}
                  className="rounded border border-border bg-card p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-primary">
                      @{comment.user?.username ?? "anonymous"}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{comment.body}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      ↑ {comment.upvotes}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      ↓ {comment.downvotes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No comments yet. Sign in to join the conversation." />
          )}
        </section>
      </div>
    </div>
  );
}

function VoteResultBadge({ result }: { result: string }) {
  const config = {
    yea: { label: "YEA", icon: TrendingUp, className: "text-endorsed bg-endorsed/10 border-endorsed/30" },
    nay: { label: "NAY", icon: TrendingDown, className: "text-anti-endorsed bg-anti-endorsed/10 border-anti-endorsed/30" },
    abstain: { label: "ABS", icon: Minus, className: "text-watching bg-watching/10 border-watching/30" },
  }[result] ?? { label: result.toUpperCase(), icon: Minus, className: "text-muted-foreground bg-secondary border-border" };

  const Icon = config.icon;

  return (
    <span className={cn("flex items-center gap-1 rounded border px-2 py-1 font-mono text-[10px] font-bold uppercase shrink-0", config.className)}>
      <Icon size={10} />
      {config.label}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-border p-6 text-center">
      <p className="font-mono text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
