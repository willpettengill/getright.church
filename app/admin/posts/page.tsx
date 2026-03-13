import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { formatDate, platformIcon, sentimentColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Posts Admin — Get Right Church" };

async function approvePost(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("posts").update({ approved: true }).eq("id", id);
  redirect("/admin/posts");
}

async function rejectPost(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("posts").delete().eq("id", id);
  redirect("/admin/posts");
}

async function createPost(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    source_platform: formData.get("source_platform") as string,
    source_url: formData.get("source_url") as string || null,
    content_text: formData.get("content_text") as string || null,
    sentiment_score: parseFloat(formData.get("sentiment_score") as string) || 0,
    approved: true,
  });
  if (error) redirect("/admin/posts?error=" + encodeURIComponent(error.message));
  redirect("/admin/posts");
}

export default async function AdminPostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const allPosts = (posts ?? []) as Post[];
  const pending = allPosts.filter((p) => !p.approved);
  const approved = allPosts.filter((p) => p.approved);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="label-mono mb-1">Admin</p>
          <h1 className="font-sans text-2xl font-bold text-foreground">Posts</h1>
        </div>
      </div>

      {/* Add Post Form */}
      <details className="mb-8 rounded-md border border-border bg-card">
        <summary className="cursor-pointer px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-2">
          <Plus size={12} />
          Add New Post
        </summary>
        <form action={createPost} className="flex flex-col gap-4 p-4 border-t border-border">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="label-mono">Platform</label>
              <select name="source_platform" required
                className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
                <option value="twitter">Twitter / X</option>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="reddit">Reddit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-mono">Sentiment Score (-100 to 100)</label>
              <input name="sentiment_score" type="number" min="-100" max="100" defaultValue="0"
                className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-mono">Source URL</label>
            <input name="source_url" type="url" placeholder="https://..."
              className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label-mono">Content</label>
            <textarea name="content_text" rows={3} placeholder="Post content..."
              className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none" />
          </div>
          <button type="submit"
            className="self-start rounded bg-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Post
          </button>
        </form>
      </details>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="label-mono mb-3 text-watching">Pending Approval ({pending.length})</h2>
          <PostTable posts={pending} approveAction={approvePost} rejectAction={rejectPost} showActions />
        </section>
      )}

      {/* Approved */}
      <section>
        <h2 className="label-mono mb-3 text-foreground">Approved ({approved.length})</h2>
        <PostTable posts={approved} rejectAction={rejectPost} />
      </section>
    </div>
  );
}

function PostTable({
  posts,
  approveAction,
  rejectAction,
  showActions = false,
}: {
  posts: Post[];
  approveAction?: (fd: FormData) => Promise<void>;
  rejectAction: (fd: FormData) => Promise<void>;
  showActions?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-4 py-3 text-left label-mono">Platform</th>
            <th className="px-4 py-3 text-left label-mono">Content</th>
            <th className="px-4 py-3 text-left label-mono">Score</th>
            <th className="px-4 py-3 text-left label-mono">Date</th>
            <th className="px-4 py-3 text-left label-mono">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-secondary font-mono text-[10px] font-bold text-muted-foreground">
                  {platformIcon(post.source_platform)}
                </span>
              </td>
              <td className="px-4 py-3 max-w-xs">
                <p className="truncate text-foreground/80 text-xs">{post.content_text ?? "—"}</p>
              </td>
              <td className="px-4 py-3">
                <span className={cn("font-mono text-xs", sentimentColor(post.sentiment_score))}>
                  {post.sentiment_score > 0 ? "+" : ""}{Math.round(post.sentiment_score)}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                {formatDate(post.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {showActions && approveAction && (
                    <form action={approveAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" className="font-mono text-[10px] text-endorsed hover:underline">
                        Approve
                      </button>
                    </form>
                  )}
                  <form action={rejectAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="font-mono text-[10px] text-anti-endorsed hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {posts.length === 0 && (
        <div className="p-6 text-center">
          <p className="font-mono text-xs text-muted-foreground">No posts.</p>
        </div>
      )}
    </div>
  );
}
