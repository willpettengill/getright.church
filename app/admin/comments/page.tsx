import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = { title: "Comments Admin — Get Right Church" };

async function deleteComment(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("comments").delete().eq("id", id);
  redirect("/admin/comments");
}

async function flagComment(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const flagged = formData.get("flagged") === "true";
  await supabase.from("comments").update({ flagged: !flagged }).eq("id", id);
  redirect("/admin/comments");
}

export default async function AdminCommentsPage() {
  const supabase = await createClient();

  const { data: comments } = await supabase
    .from("comments")
    .select("*, user:users(username), politician:politicians(name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <p className="label-mono mb-1">Admin</p>
        <h1 className="font-sans text-2xl font-bold text-foreground">Comments</h1>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left label-mono">User</th>
              <th className="px-4 py-3 text-left label-mono">Politician</th>
              <th className="px-4 py-3 text-left label-mono">Comment</th>
              <th className="px-4 py-3 text-left label-mono">Date</th>
              <th className="px-4 py-3 text-left label-mono">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(comments ?? []).map((comment: any) => (
              <tr
                key={comment.id}
                className={`border-b border-border hover:bg-secondary/30 transition-colors ${
                  comment.flagged ? "bg-anti-endorsed/5" : ""
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-primary">
                  @{comment.user?.username ?? "anon"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {comment.politician?.name ?? "—"}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="truncate text-xs text-foreground/80">{comment.body}</p>
                  {comment.flagged && (
                    <span className="mt-0.5 inline-block font-mono text-[10px] text-anti-endorsed">
                      flagged
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                  {formatDate(comment.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <form action={flagComment}>
                      <input type="hidden" name="id" value={comment.id} />
                      <input type="hidden" name="flagged" value={String(comment.flagged)} />
                      <button type="submit" className="font-mono text-[10px] text-watching hover:underline">
                        {comment.flagged ? "Unflag" : "Flag"}
                      </button>
                    </form>
                    <form action={deleteComment}>
                      <input type="hidden" name="id" value={comment.id} />
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
        {(!comments || comments.length === 0) && (
          <div className="p-6 text-center">
            <p className="font-mono text-xs text-muted-foreground">No comments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
