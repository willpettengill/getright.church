"use client";

import { useState } from "react";
import { Wand2, Loader2, CheckCircle } from "lucide-react";

interface Props {
  politicianId: string;
  politicianName: string;
  hasPortrait: boolean;
}

export function GeneratePortraitButton({ politicianId, politicianName, hasPortrait }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portraits/" + politicianId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: politicianName }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to generate portrait");
      }
      setDone(true);
      // Refresh the page after a short delay to show the new portrait
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center justify-center gap-1.5 rounded border border-border px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={10} className="animate-spin" />
        ) : done ? (
          <CheckCircle size={10} className="text-endorsed" />
        ) : (
          <Wand2 size={10} />
        )}
        {loading ? "Generating..." : done ? "Done!" : hasPortrait ? "Regenerate" : "Generate"}
      </button>
      {error && (
        <p className="font-mono text-[10px] text-anti-endorsed">{error}</p>
      )}
    </div>
  );
}
