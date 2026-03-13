import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import type { Geography } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Edit Politician — Get Right Church" };

export default async function EditPoliticianPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: politician }, { data: geographies }] = await Promise.all([
    supabase.from("politicians").select("*").eq("id", id).single(),
    supabase.from("geographies").select("*").order("name"),
  ]);

  if (!politician) notFound();
  const allGeos = (geographies ?? []) as Geography[];

  async function updatePolitician(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { error } = await supabase.from("politicians").update({
      name: formData.get("name") as string,
      title: formData.get("title") as string || null,
      party: formData.get("party") as string || null,
      bio: formData.get("bio") as string || null,
      endorsement_status: formData.get("endorsement_status") as string,
      geography_id: formData.get("geography_id") as string || null,
      geography_level: formData.get("geography_level") as string || null,
      office_held: formData.get("office_held") as string || null,
      years_in_office: formData.get("years_in_office")
        ? parseInt(formData.get("years_in_office") as string)
        : null,
      aggregate_sentiment: formData.get("aggregate_sentiment")
        ? parseFloat(formData.get("aggregate_sentiment") as string)
        : 0,
    }).eq("id", id);

    if (error) {
      redirect(`/admin/politicians/${id}/edit?error=${encodeURIComponent(error.message)}`);
    }
    redirect("/admin/politicians");
  }

  async function deletePolitician() {
    "use server";
    const supabase = await createClient();
    await supabase.from("politicians").delete().eq("id", id);
    redirect("/admin/politicians");
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/politicians"
        className="mb-6 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={10} />
        Back to Politicians
      </Link>

      <div className="mb-6">
        <p className="label-mono mb-1">Admin</p>
        <h1 className="font-sans text-2xl font-bold text-foreground">Edit: {politician.name}</h1>
      </div>

      <form action={updatePolitician} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="label-mono">Full Name</label>
          <input id="name" name="name" type="text" required defaultValue={politician.name}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="label-mono">Title</label>
          <input id="title" name="title" type="text" defaultValue={politician.title ?? ""}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="party" className="label-mono">Party</label>
          <input id="party" name="party" type="text" defaultValue={politician.party ?? ""}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="office_held" className="label-mono">Office Held</label>
          <input id="office_held" name="office_held" type="text" defaultValue={politician.office_held ?? ""}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="years_in_office" className="label-mono">Years in Office</label>
          <input id="years_in_office" name="years_in_office" type="number" defaultValue={politician.years_in_office ?? ""}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="aggregate_sentiment" className="label-mono">Sentiment Score (-100 to 100)</label>
          <input id="aggregate_sentiment" name="aggregate_sentiment" type="number" min="-100" max="100"
            defaultValue={politician.aggregate_sentiment ?? 0}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endorsement_status" className="label-mono">Endorsement Status</label>
          <select id="endorsement_status" name="endorsement_status" required
            defaultValue={politician.endorsement_status}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="watching">Watching</option>
            <option value="endorsed">Endorsed</option>
            <option value="anti-endorsed">Anti-Endorsed</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="geography_level" className="label-mono">Geography Level</label>
          <select id="geography_level" name="geography_level" defaultValue={politician.geography_level ?? ""}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="">Select level...</option>
            <option value="federal">Federal</option>
            <option value="state">State</option>
            <option value="local">Local</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="geography_id" className="label-mono">Geography</label>
          <select id="geography_id" name="geography_id" defaultValue={politician.geography_id ?? ""}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
            <option value="">None</option>
            {allGeos.map((g) => (
              <option key={g.id} value={g.id}>{g.name} ({g.type})</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bio" className="label-mono">Bio</label>
          <textarea id="bio" name="bio" rows={4} defaultValue={politician.bio ?? ""}
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit"
            className="rounded bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
          <form action={deletePolitician}>
            <button type="submit"
              className="rounded border border-anti-endorsed/50 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-anti-endorsed hover:bg-anti-endorsed/10 transition-colors">
              Delete
            </button>
          </form>
        </div>
      </form>
    </div>
  );
}
