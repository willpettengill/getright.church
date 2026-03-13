import { createClient } from '@/lib/supabase/server'
import type { Politician, Post, Vote, Comment, Geography } from '@/lib/types'

export async function getPoliticians(
  geographyId?: string,
  limit = 50,
): Promise<Politician[]> {
  const supabase = await createClient()
  let query = supabase
    .from('politicians')
    .select('*')
    .order('aggregate_sentiment', { ascending: false })
    .limit(limit)

  if (geographyId) {
    query = query.eq('geography_id', geographyId)
  }

  const { data, error } = await query
  if (error) {
    console.error('[v0] getPoliticians error:', error.message)
    return []
  }
  return (data ?? []) as Politician[]
}

export async function getPolitician(slug: string): Promise<Politician> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('politicians')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    throw new Error(`Politician not found: ${slug}`)
  }
  return data as Politician
}

export async function getPosts(
  geographyId?: string,
  politicianId?: string,
  limit = 20,
): Promise<Post[]> {
  const supabase = await createClient()
  let query = supabase
    .from('posts')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (geographyId) {
    query = query.eq('geography_id', geographyId)
  }
  if (politicianId) {
    query = query.contains('politician_ids', [politicianId])
  }

  const { data, error } = await query
  if (error) {
    console.error('[v0] getPosts error:', error.message)
    return []
  }
  return (data ?? []) as Post[]
}

export async function getVotes(
  politicianId: string,
  limit = 20,
): Promise<Vote[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('politician_id', politicianId)
    .order('vote_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[v0] getVotes error:', error.message)
    return []
  }
  return (data ?? []) as Vote[]
}

export async function getComments(
  politicianId: string,
  limit = 20,
): Promise<Comment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:users(username)')
    .eq('politician_id', politicianId)
    .eq('flagged', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[v0] getComments error:', error.message)
    return []
  }
  return (data ?? []) as Comment[]
}

export async function getGeographies(parentId?: string): Promise<Geography[]> {
  const supabase = await createClient()
  let query = supabase
    .from('geographies')
    .select('*')
    .order('name', { ascending: true })

  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }

  const { data, error } = await query
  if (error) {
    console.error('[v0] getGeographies error:', error.message)
    return []
  }
  return (data ?? []) as Geography[]
}

export async function getGeography(slug: string): Promise<Geography> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('geographies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    throw new Error(`Geography not found: ${slug}`)
  }
  return data as Geography
}
