import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Geography } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Add Politician — Get Right Church" };

export default async function NewPoliticianPage() {
  const supabase = await createClient();
  const { data: geographies } = await supabase
    .from("geographies")
    .select("*")
    .order("name");

  const allGeos = (geographies ?? []) as Geography[];

  async function createPolitician(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const slug = (formData.get("name") as string)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const { error } = await supabase.from("politicians").insert({
      slug,
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
    });

    if (error) {
      redirect("/admin/politicians/new?error=" + encodeURIComponent(error.message));
    }
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
        <h1 className="font-sans text-2xl font-bold text-foreground">Add Politician</h1>
      </div>

      <form action={createPolitician} className="flex flex-col gap-5">
        <FormField label="Full Name" name="name" required placeholder="Jane Doe" />
        <FormField label="Title" name="title" placeholder="U.S. Senator" />
        <FormField label="Party" name="party" placeholder="Independent" />
        <FormField label="Office Held" name="office_held" placeholder="U.S. Senate" />
        <FormField label="Years in Office" name="years_in_office" type="number" placeholder="4" />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="endorsement_status" className="label-mono">Endorsement Status</label>
          <select
            id="endorsement_status"
            name="endorsement_status"
            required
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="watching">Watching</option>
            <option value="endorsed">Endorsed</option>
            <option value="anti-endorsed">Anti-Endorsed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="geography_level" className="label-mono">Geography Level</label>
          <select
            id="geography_level"
            name="geography_level"
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select level...</option>
            <option value="federal">Federal</option>
            <option value="state">State</option>
            <option value="local">Local</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="geography_id" className="label-mono">Geography</label>
          <select
            id="geography_id"
            name="geography_id"
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Select geography...</option>
            {allGeos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="bio" className="label-mono">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            placeholder="Short biography or summary..."
            className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors self-start"
        >
          Create Politician
        </button>
      </form>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="label-mono">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </div>
  );
}
