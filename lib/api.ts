import { createClient } from '@/lib/supabase/server'
import type { Politician, Post, Vote, Comment, Geography, IssueWithVotes, IssuePositionWithPolitician, PoliticianIssue } from '@/lib/types'

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

export async function getIssues(): Promise<IssueWithVotes[]> {
  const supabase = await createClient()
  const { data: issues, error } = await supabase
    .from('issues')
    .select('*')
    .order('category', { ascending: true })

  if (error || !issues) {
    console.error('[v0] getIssues error:', error?.message)
    return []
  }

  const { data: votes } = await supabase
    .from('issue_votes')
    .select('issue_id, vote')

  const votemap = (votes ?? []).reduce<Record<string, Record<string, number>>>((acc, v) => {
    if (!acc[v.issue_id]) acc[v.issue_id] = { support: 0, oppose: 0, neutral: 0 }
    acc[v.issue_id][v.vote] = (acc[v.issue_id][v.vote] ?? 0) + 1
    return acc
  }, {})

  return issues.map((issue) => {
    const vm = votemap[issue.id] ?? { support: 0, oppose: 0, neutral: 0 }
    return {
      ...issue,
      support_count: vm.support,
      oppose_count: vm.oppose,
      neutral_count: vm.neutral,
      total_count: vm.support + vm.oppose + vm.neutral,
    }
  })
}

export async function getIssue(slug: string): Promise<IssueWithVotes> {
  const supabase = await createClient()
  const { data: issue, error } = await supabase
    .from('issues')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !issue) throw new Error(`Issue not found: ${slug}`)

  const { data: votes } = await supabase
    .from('issue_votes')
    .select('vote')
    .eq('issue_id', issue.id)

  const counts = (votes ?? []).reduce<Record<string, number>>(
    (acc, v) => { acc[v.vote] = (acc[v.vote] ?? 0) + 1; return acc },
    { support: 0, oppose: 0, neutral: 0 }
  )

  return {
    ...issue,
    support_count: counts.support,
    oppose_count: counts.oppose,
    neutral_count: counts.neutral,
    total_count: counts.support + counts.oppose + counts.neutral,
  }
}

export async function getIssuePositions(issueId: string): Promise<IssuePositionWithPolitician[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('politician_issue_positions')
    .select(`
      *,
      politician:politicians(id, slug, name, title, party, portrait_url, endorsement_status)
    `)
    .eq('issue_id', issueId)
    .order('position', { ascending: true })

  if (error) {
    console.error('[v0] getIssuePositions error:', error.message)
    return []
  }
  return (data ?? []) as IssuePositionWithPolitician[]
}

export async function getPoliticiansCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('politicians')
    .select('*', { count: 'exact', head: true })
  return count ?? 0
}

export async function getPostsCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
  return count ?? 0
}

type RawIssuePositionRow = {
  position: string
  notes: string | null
  issue: {
    id: string
    title: string
    slug: string
    category: string
    description: string | null
    created_at: string
  } | null
}

export async function getPoliticianIssuePositions(politicianId: string): Promise<PoliticianIssue[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('politician_issue_positions')
    .select(`
      position,
      notes,
      issue:issues(*)
    `)
    .eq('politician_id', politicianId)

  if (error) {
    console.error('[v0] getPoliticianIssuePositions error:', error.message)
    return []
  }

  return (data ?? [] as unknown as RawIssuePositionRow[]).map((row) => ({
    ...row.issue,
    position: row.position,
    notes: row.notes,
  })) as unknown as PoliticianIssue[]
}
