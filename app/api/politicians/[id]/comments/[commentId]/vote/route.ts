import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CommentVoteRequest, CommentVoteResponse } from '@/lib/api-types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId } = await params
    const body = await request.json() as CommentVoteRequest

    const supabase = await createClient()

    const column = body.direction === 'up' ? 'upvotes' : 'downvotes'

    // Get current count
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('upvotes, downvotes')
      .eq('id', commentId)
      .single()

    if (fetchError || !comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    const currentCount = (comment[column] as number | null) ?? 0

    const { data, error } = await supabase
      .from('comments')
      .update({ [column]: currentCount + 1 })
      .eq('id', commentId)
      .select('upvotes, downvotes')
      .single()

    if (error) throw error

    const response: CommentVoteResponse = {
      upvotes: data.upvotes ?? 0,
      downvotes: data.downvotes ?? 0,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}
