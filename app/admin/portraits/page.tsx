import { createClient } from "@/lib/supabase/server";
import type { Politician } from "@/lib/types";
import Image from "next/image";
import { User } from "lucide-react";
import { GeneratePortraitButton } from "@/components/admin/generate-portrait-button";

export const metadata = { title: "Portraits Admin — Get Right Church" };

export default async function AdminPortraitsPage() {
  const supabase = await createClient();

  const { data: politicians } = await supabase
    .from("politicians")
    .select("id, name, title, portrait_url, slug")
    .order("name");

  const allPols = (politicians ?? []) as Pick<Politician, "id" | "name" | "title" | "portrait_url" | "slug">[];

  return (
    <div>
      <div className="mb-6">
        <p className="label-mono mb-1">Admin</p>
        <h1 className="font-sans text-2xl font-bold text-foreground">AI Portraits</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate Pixar-style 3D portraits for politicians using DALL-E 3.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {allPols.map((pol) => (
          <div key={pol.id} className="rounded-md border border-border bg-card p-3 flex flex-col gap-3">
            {/* Portrait preview */}
            <div className="relative aspect-square overflow-hidden rounded bg-secondary">
              {pol.portrait_url ? (
                <Image
                  src={pol.portrait_url}
                  alt={pol.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User size={32} className="text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="font-sans font-semibold text-foreground text-xs leading-tight">{pol.name}</p>
              {pol.title && (
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5 truncate">{pol.title}</p>
              )}
            </div>

            <GeneratePortraitButton politicianId={pol.id} politicianName={pol.name} hasPortrait={!!pol.portrait_url} />
          </div>
        ))}
      </div>
    </div>
  );
}
