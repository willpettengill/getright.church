import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = await createClient()

    // Validate admin access
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { posts, votes } = body

    // Ingest posts
    if (posts && Array.isArray(posts)) {
      const { error: postsError } = await supabase
        .from('posts')
        .insert(posts.map((p) => ({
          source_platform: p.source_platform,
          source_url: p.source_url,
          content_text: p.content_text,
          content_embed_html: p.content_embed_html,
          sentiment_score: p.sentiment_score || 0,
          politician_ids: p.politician_ids || [],
          geography_id: p.geography_id,
          approved: p.approved || false,
        })))

      if (postsError) throw postsError
    }

    // Ingest votes
    if (votes && Array.isArray(votes)) {
      const { error: votesError } = await supabase
        .from('votes')
        .insert(votes.map((v) => ({
          politician_id: v.politician_id,
          bill_name: v.bill_name,
          bill_id: v.bill_id,
          vote_date: v.vote_date,
          vote_result: v.vote_result,
          policy_category: v.policy_category,
          source_url: v.source_url,
        })))

      if (votesError) throw votesError
    }

    return NextResponse.json(
      {
        success: true,
        posts_ingested: posts?.length || 0,
        votes_ingested: votes?.length || 0,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json(
      { error: 'Failed to ingest data' },
      { status: 500 }
    )
  }
}
