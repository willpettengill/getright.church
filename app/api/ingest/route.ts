import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ingest
 * Accepts a JSON payload with post data and queues it for admin review.
 * Requires a shared INGEST_SECRET header for basic auth.
 *
 * Body:
 * {
 *   source_platform: string,
 *   source_url?: string,
 *   content_text?: string,
 *   content_embed_html?: string,
 *   sentiment_score?: number,
 *   politician_ids?: string[],
 *   geography_id?: string
 * }
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-ingest-secret");
  if (!secret || secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { source_platform, source_url, content_text, content_embed_html, sentiment_score, politician_ids, geography_id } = body;

  if (!source_platform) {
    return NextResponse.json({ error: "source_platform is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      source_platform,
      source_url: source_url ?? null,
      content_text: content_text ?? null,
      content_embed_html: content_embed_html ?? null,
      sentiment_score: typeof sentiment_score === "number" ? sentiment_score : 0,
      politician_ids: Array.isArray(politician_ids) ? politician_ids : [],
      geography_id: geography_id ?? null,
      approved: false, // always pending review
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
