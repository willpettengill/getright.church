export interface Geography {
  id: string
  name: string
  slug: string
  type: string
  parent_id: string | null
  boundary_geojson: object | null
  created_at: string
}

export interface Politician {
  id: string
  name: string
  slug: string
  title: string | null
  party: string | null
  bio: string | null
  office_held: string | null
  years_in_office: number | null
  aggregate_sentiment: number
  endorsement_status: 'endorsed' | 'anti-endorsed' | 'watching' | 'neutral'
  portrait_url: string | null
  portrait_style: string | null
  geography_id: string | null
  geography_level: string | null
  policy_alignment: Record<string, number> | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  content_text: string
  content_embed_html: string | null
  source_platform: string | null
  source_url: string | null
  sentiment_score: number
  approved: boolean
  geography_id: string | null
  politician_ids: string[] | null
  created_at: string
}

export interface Vote {
  id: string
  politician_id: string
  bill_id: string | null
  bill_name: string | null
  vote_result: 'yea' | 'nay' | 'abstain' | 'absent'
  policy_category: string | null
  vote_date: string | null
  source_url: string | null
  created_at: string
}

export interface Comment {
  id: string
  politician_id: string
  user_id: string | null
  parent_id: string | null
  body: string
  upvotes: number
  downvotes: number
  flagged: boolean
  created_at: string
  user?: {
    username: string | null
  }
}

export interface User {
  id: string
  username: string | null
  role: 'admin' | 'member' | 'guest'
  created_at: string
}

export interface EndorsementLog {
  id: string
  politician_id: string
  changed_by: string | null
  previous_status: string | null
  new_status: string
  reason: string | null
  created_at: string
}

export interface Entity {
  id: string
  name: string
  type: string
  description: string | null
  external_url: string | null
  created_at: string
}

export interface Relationship {
  id: string
  entity_a_id: string
  entity_a_type: string
  entity_b_id: string
  entity_b_type: string
  relationship_type: string
  weight: number | null
  metadata_json: object | null
  created_at: string
}
