import type {
  Comment,
  PostInsert,
  VoteInsert,
  Bill,
} from './types'

// POST /api/ingest
export interface IngestRequest {
  posts?: PostInsert[]
  votes?: VoteInsert[]
}
export interface IngestResponse {
  success: boolean
  posts_ingested: number
  votes_ingested: number
}

// POST /api/politicians/[id]/comments
export interface CreateCommentRequest {
  body: string
}
export interface CreateCommentResponse {
  comment: Comment
}

// GET /api/politicians/[id]/comments
export interface GetCommentsResponse {
  comments: Comment[]
}

// POST /api/portraits/[id]
export interface UpdatePortraitRequest {
  portrait_url: string
  portrait_style?: string
}
export interface UpdatePortraitResponse {
  success: boolean
  message: string
}

// GET /api/portraits/[id]
export interface GetPortraitResponse {
  id: string
  name: string
  portrait_url: string | null
  portrait_style: string | null
}

// Issues
export interface IssueResponse {
  id: string
  slug: string
  title: string
  description: string | null
  category: string
  support_count: number
  oppose_count: number
  neutral_count: number
  total_count: number
  created_at: string
}

export interface IssuePositionResponse {
  id: string
  position: 'support' | 'oppose' | 'neutral'
  notes: string | null
  politician: {
    id: string
    slug: string
    name: string
    title: string | null
    party: string | null
    portrait_url: string | null
    endorsement_status: string
  }
}

export interface IssueVoteRequest {
  vote: 'support' | 'oppose' | 'neutral'
}

// POST /api/politicians/[id]/comments/[commentId]/vote
export interface CommentVoteRequest {
  direction: 'up' | 'down'
}
export interface CommentVoteResponse {
  upvotes: number
  downvotes: number
}

// ── Score System ──────────────────────────────────────────────────────────────

export interface SimilarPoliticianResponse {
  id: string
  name: string
  slug: string
  party: string | null
  portrait_url: string | null
  state_abbrev: string | null
  chamber: string | null
  similarity: number
  shared_votes: number
}

export interface NetworkNode {
  id: string
  name: string
  type: string           // entity type or 'politician'
  node_type: 'politician' | 'entity'
}

export interface NetworkEdge {
  source: string         // entity id
  target: string         // politician id
  relationship_type: string
  weight: number | null
}

export interface NetworkGraphResponse {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
}

export interface ScoreLeaderboardEntry {
  id: string
  name: string
  slug: string
  party: string | null
  state_abbrev: string | null
  chamber: string | null
  endorsement_status: string
  score_value: number
}

export type BillResponse = Pick<
  Bill,
  'id' | 'bill_id' | 'name' | 'description' | 'policy_category' | 'chamber' | 'congress' | 'vote_date' | 'party_position_dem' | 'party_position_rep' | 'is_bipartisan'
>
