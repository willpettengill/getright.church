// Derived from lib/database.types.ts — do not hand-edit column shapes here.
// To add a new table: run `npm run gen:types`, then add an export below.
import type { Database } from './database.types'

export type Geography = Database['public']['Tables']['geographies']['Row']
export type GeographyInsert = Database['public']['Tables']['geographies']['Insert']
export type GeographyUpdate = Database['public']['Tables']['geographies']['Update']

export type Politician = Database['public']['Tables']['politicians']['Row']
export type PoliticianInsert = Database['public']['Tables']['politicians']['Insert']
export type PoliticianUpdate = Database['public']['Tables']['politicians']['Update']

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type Vote = Database['public']['Tables']['votes']['Row']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// Comment with optional joined user data
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  user?: { username: string | null }
}
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']

export type Entity = Database['public']['Tables']['entities']['Row']
export type EntityInsert = Database['public']['Tables']['entities']['Insert']
export type EntityUpdate = Database['public']['Tables']['entities']['Update']

export type Relationship = Database['public']['Tables']['relationships']['Row']
export type RelationshipInsert = Database['public']['Tables']['relationships']['Insert']
export type RelationshipUpdate = Database['public']['Tables']['relationships']['Update']

export type EndorsementLog = Database['public']['Tables']['endorsement_log']['Row']
export type EndorsementLogInsert = Database['public']['Tables']['endorsement_log']['Insert']
export type EndorsementLogUpdate = Database['public']['Tables']['endorsement_log']['Update']

export type Issue = Database['public']['Tables']['issues']['Row']
export type IssueInsert = Database['public']['Tables']['issues']['Insert']
export type IssueUpdate = Database['public']['Tables']['issues']['Update']

export type IssuePosition = Database['public']['Tables']['politician_issue_positions']['Row']
export type IssuePositionInsert = Database['public']['Tables']['politician_issue_positions']['Insert']

export type IssueVote = Database['public']['Tables']['issue_votes']['Row']
export type IssueVoteInsert = Database['public']['Tables']['issue_votes']['Insert']

// Issue with community vote totals
export type IssueWithVotes = Issue & {
  support_count: number
  oppose_count: number
  neutral_count: number
  total_count: number
}

// Issue position with joined politician info
export type IssuePositionWithPolitician = IssuePosition & {
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

// Politician issue (issue with the politician's position attached)
export type PoliticianIssue = Issue & {
  position: string | null
  notes: string | null
}
