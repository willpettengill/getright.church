import { createClient } from '@/lib/supabase/server'
import type { Politician, Post, Vote, Comment, Geography, IssueWithVotes, IssuePositionWithPolitician, PoliticianIssue, Bill } from '@/lib/types'
import type { SimilarPoliticianResponse, NetworkGraphResponse, ScoreLeaderboardEntry, BillResponse } from '@/lib/api-types'

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

export async function getGeographies(parentId?: string, type?: string): Promise<Geography[]> {
  const supabase = await createClient()
  let query = supabase
    .from('geographies')
    .select('*')
    .order('name', { ascending: true })

  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else if (type) {
    query = query.eq('type', type)   // no parent_id filter — returns all of that type
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

export async function getSimilarPoliticians(
  politicianId: string,
  limit = 5,
): Promise<SimilarPoliticianResponse[]> {
  const supabase = await createClient()

  // Query 1: where politician_a_id = politicianId
  const { data: data1, error: error1 } = await supabase
    .from('politician_similarities')
    .select('politician_b_id, similarity, shared_votes')
    .eq('politician_a_id', politicianId)

  // Query 2: where politician_b_id = politicianId
  const { data: data2, error: error2 } = await supabase
    .from('politician_similarities')
    .select('politician_a_id, similarity, shared_votes')
    .eq('politician_b_id', politicianId)

  if (error1 || error2) {
    console.error('[v0] getSimilarPoliticians error:', error1?.message || error2?.message)
    return []
  }

  // Merge results and extract the other politician IDs
  const otherIds = [
    ...(data1 ?? []).map((row: any) => row.politician_b_id),
    ...(data2 ?? []).map((row: any) => row.politician_a_id),
  ]

  if (otherIds.length === 0) {
    return []
  }

  // Fetch politician data for those IDs
  const { data: politicians, error: politiciansError } = await supabase
    .from('politicians')
    .select('id, name, slug, party, portrait_url, state_abbrev, chamber')
    .in('id', otherIds)

  if (politiciansError) {
    console.error('[v0] getSimilarPoliticians (fetch politicians) error:', politiciansError.message)
    return []
  }

  // Merge similarity scores with politician data
  const merged = [
    ...(data1 ?? []).map((row: any) => ({
      politician: (politicians ?? []).find((p: any) => p.id === row.politician_b_id),
      similarity: row.similarity,
      shared_votes: row.shared_votes,
    })),
    ...(data2 ?? []).map((row: any) => ({
      politician: (politicians ?? []).find((p: any) => p.id === row.politician_a_id),
      similarity: row.similarity,
      shared_votes: row.shared_votes,
    })),
  ]

  // Sort by similarity descending and take limit
  return merged
    .sort((a, b) => b.similarity - a.similarity)
    .filter((item) => item.politician)
    .slice(0, limit)
    .map((item) => ({
      ...item.politician,
      similarity: item.similarity,
      shared_votes: item.shared_votes,
    })) as SimilarPoliticianResponse[]
}

export async function getPoliticianNetwork(politicianId: string): Promise<NetworkGraphResponse> {
  const supabase = await createClient()

  // Get the politician
  const { data: politician, error: politicianError } = await supabase
    .from('politicians')
    .select('id, name')
    .eq('id', politicianId)
    .single()

  if (politicianError || !politician) {
    console.error('[v0] getPoliticianNetwork error:', politicianError?.message)
    return { nodes: [], edges: [] }
  }

  // Get relationships where entity_b_id = politicianId AND entity_b_type = 'politician'
  const { data: relationships, error: relationshipsError } = await supabase
    .from('relationships')
    .select('id, entity_a_id, entity_a_type, relationship_type, weight')
    .eq('entity_b_id', politicianId)
    .eq('entity_b_type', 'politician')

  if (relationshipsError) {
    console.error('[v0] getPoliticianNetwork (relationships) error:', relationshipsError.message)
  }

  // Extract unique entity_a_ids
  const entityIds = ((relationships ?? []) as any[]).map((r) => r.entity_a_id)

  let entities: any[] = []
  if (entityIds.length > 0) {
    const { data: entitiesData, error: entitiesError } = await supabase
      .from('entities')
      .select('id, name, type')
      .in('id', entityIds)

    if (entitiesError) {
      console.error('[v0] getPoliticianNetwork (entities) error:', entitiesError.message)
    } else {
      entities = entitiesData ?? []
    }
  }

  // Build nodes
  const nodes = [
    {
      id: politician.id,
      name: politician.name,
      type: 'politician',
      node_type: 'politician' as const,
    },
    ...entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      node_type: 'entity' as const,
    })),
  ]

  // Build edges
  const edges = ((relationships ?? []) as any[]).map((rel) => ({
    source: rel.entity_a_id,
    target: politicianId,
    relationship_type: rel.relationship_type,
    weight: rel.weight,
  }))

  return { nodes, edges }
}

export async function getScoreLeaderboard(
  score: 'party_line_score' | 'bipartisan_score' | 'independence_score' | 'controversy_score' | 'consistency_score' | 'donor_influence_score',
  direction: 'asc' | 'desc',
  limit = 10,
): Promise<ScoreLeaderboardEntry[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('politicians')
    .select('id, name, slug, party, state_abbrev, chamber, endorsement_status, ' + score)
    .not(score, 'is', null)
    .order(score, { ascending: direction === 'asc' })
    .limit(limit)

  if (error) {
    console.error('[v0] getScoreLeaderboard error:', error.message)
    return []
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    party: row.party,
    state_abbrev: row.state_abbrev,
    chamber: row.chamber,
    endorsement_status: row.endorsement_status,
    score_value: row[score],
  })) as ScoreLeaderboardEntry[]
}

export async function getPoliticiansByState(stateAbbrev: string): Promise<Politician[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('politicians')
    .select('*')
    .eq('state_abbrev', stateAbbrev)
    .order('chamber', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('[v0] getPoliticiansByState error:', error.message)
    return []
  }

  return (data ?? []) as Politician[]
}

export async function getBills(
  policyCategory?: string,
  chamber?: string,
  limit = 50,
): Promise<BillResponse[]> {
  const supabase = await createClient()

  let query = supabase
    .from('bills')
    .select('*')
    .order('vote_date', { ascending: false })
    .limit(limit)

  if (policyCategory) {
    query = query.eq('policy_category', policyCategory)
  }

  if (chamber) {
    query = query.eq('chamber', chamber)
  }

  const { data, error } = await query

  if (error) {
    console.error('[v0] getBills error:', error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    bill_id: row.bill_id,
    name: row.name,
    description: row.description,
    policy_category: row.policy_category,
    chamber: row.chamber,
    congress: row.congress,
    vote_date: row.vote_date,
    party_position_dem: row.party_position_dem,
    party_position_rep: row.party_position_rep,
    is_bipartisan: row.is_bipartisan,
  })) satisfies BillResponse[]
}

export async function getPlatformStats(): Promise<{ politicians: number; issues: number; geographies: number; posts: number }> {
  const supabase = await createClient()

  // Parallel count queries
  const [
    { count: politiciansCount },
    { count: issuesCount },
    { count: geographiesCount },
    { count: postsCount },
  ] = await Promise.all([
    supabase
      .from('politicians')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('issues')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('geographies')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true }),
  ])

  return {
    politicians: politiciansCount ?? 0,
    issues: issuesCount ?? 0,
    geographies: geographiesCount ?? 0,
    posts: postsCount ?? 0,
  }
}
