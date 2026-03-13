import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { body: commentBody } = body

    if (!commentBody || commentBody.trim().length === 0) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        politician_id: id,
        user_id: user.id,
        body: commentBody,
        upvotes: 0,
        downvotes: 0,
        flagged: false,
      })
      .select()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('politician_id', id)
      .eq('flagged', false)
      .isNull('parent_id')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Fetch comments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
