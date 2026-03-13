import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin — Get Right Church" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: politicianCount },
    { count: postCount },
    { count: commentCount },
    { count: pendingCount },
  ] = await Promise.all([
    supabase.from("politicians").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("approved", true),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("approved", false),
  ]);

  const stats = [
    { label: "Politicians", value: politicianCount ?? 0 },
    { label: "Approved Posts", value: postCount ?? 0 },
    { label: "Comments", value: commentCount ?? 0 },
    { label: "Posts Pending", value: pendingCount ?? 0, highlight: (pendingCount ?? 0) > 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="label-mono mb-1">Dashboard</p>
        <h1 className="font-sans text-2xl font-bold text-foreground">Overview</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-md border bg-card p-5 ${
              stat.highlight ? "border-watching/50" : "border-border"
            }`}
          >
            <p className="label-mono mb-2">{stat.label}</p>
            <span
              className={`font-mono text-3xl font-bold ${
                stat.highlight ? "text-watching" : "text-foreground"
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid gap-3 md:grid-cols-2">
        <QuickLinkCard
          href="/admin/politicians"
          title="Manage Politicians"
          description="Add, edit, or remove politicians from the database."
        />
        <QuickLinkCard
          href="/admin/posts"
          title="Moderate Posts"
          description="Review and approve or reject incoming Pulse posts."
        />
        <QuickLinkCard
          href="/admin/portraits"
          title="Generate Portraits"
          description="Generate AI Pixar-style portraits for politicians."
        />
        <QuickLinkCard
          href="/admin/comments"
          title="Manage Comments"
          description="Flag or remove inappropriate comments from The Talk."
        />
      </div>
    </div>
  );
}

function QuickLinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="rounded-md border border-border bg-card p-5 hover:border-primary/50 transition-colors"
    >
      <h3 className="font-sans font-semibold text-foreground text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </a>
  );
}
