import type {
  Comment,
  PostInsert,
  VoteInsert,
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
