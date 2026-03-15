import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { UpdatePortraitRequest, UpdatePortraitResponse, GetPortraitResponse } from '@/lib/api-types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const { portrait_url, portrait_style } = body as UpdatePortraitRequest

    // Update politician with portrait
    const { error } = await supabase
      .from('politicians')
      .update({
        portrait_url,
        portrait_style,
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json<UpdatePortraitResponse>(
      {
        success: true,
        message: 'Portrait updated',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Portrait generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate portrait' },
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
      .from('politicians')
      .select('id, name, portrait_url, portrait_style')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json<GetPortraitResponse>(data, { status: 200 })
  } catch (error) {
    console.error('Fetch portrait error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portrait' },
      { status: 500 }
    )
  }
}
