export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      geographies: {
        Row: {
          id: string
          slug: string
          name: string
          type: string
          parent_id: string | null
          boundary_geojson: Json | null
          created_at: string
          population: number | null
          political_lean: string | null
          last_result_dem_pct: number | null
          last_result_rep_pct: number | null
          last_election_year: number | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          type: string
          parent_id?: string | null
          boundary_geojson?: Json | null
          created_at?: string
          population?: number | null
          political_lean?: string | null
          last_result_dem_pct?: number | null
          last_result_rep_pct?: number | null
          last_election_year?: number | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          type?: string
          parent_id?: string | null
          boundary_geojson?: Json | null
          created_at?: string
          population?: number | null
          political_lean?: string | null
          last_result_dem_pct?: number | null
          last_result_rep_pct?: number | null
          last_election_year?: number | null
        }
        Relationships: []
      }
      politicians: {
        Row: {
          id: string
          slug: string
          name: string
          title: string | null
          party: string | null
          bio: string | null
          endorsement_status: string
          geography_id: string | null
          portrait_url: string | null
          portrait_style: string | null
          office_held: string | null
          years_in_office: number | null
          geography_level: string | null
          aggregate_sentiment: number | null
          policy_alignment: Json | null
          epstein_score: number | null
          blunch: boolean | null
          is_squid: boolean | null
          party_line_score: number | null
          bipartisan_score: number | null
          independence_score: number | null
          district_alignment_score: number | null
          controversy_score: number | null
          consistency_score: number | null
          donor_influence_score: number | null
          state_abbrev: string | null
          chamber: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          title?: string | null
          party?: string | null
          bio?: string | null
          endorsement_status?: string
          geography_id?: string | null
          portrait_url?: string | null
          portrait_style?: string | null
          office_held?: string | null
          years_in_office?: number | null
          geography_level?: string | null
          aggregate_sentiment?: number | null
          policy_alignment?: Json | null
          epstein_score?: number | null
          blunch?: boolean | null
          is_squid?: boolean | null
          party_line_score?: number | null
          bipartisan_score?: number | null
          independence_score?: number | null
          district_alignment_score?: number | null
          controversy_score?: number | null
          consistency_score?: number | null
          donor_influence_score?: number | null
          state_abbrev?: string | null
          chamber?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          title?: string | null
          party?: string | null
          bio?: string | null
          endorsement_status?: string
          geography_id?: string | null
          portrait_url?: string | null
          portrait_style?: string | null
          office_held?: string | null
          years_in_office?: number | null
          geography_level?: string | null
          aggregate_sentiment?: number | null
          policy_alignment?: Json | null
          epstein_score?: number | null
          blunch?: boolean | null
          is_squid?: boolean | null
          party_line_score?: number | null
          bipartisan_score?: number | null
          independence_score?: number | null
          district_alignment_score?: number | null
          controversy_score?: number | null
          consistency_score?: number | null
          donor_influence_score?: number | null
          state_abbrev?: string | null
          chamber?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          source_platform: string
          source_url: string | null
          content_text: string | null
          content_embed_html: string | null
          sentiment_score: number | null
          politician_ids: string[] | null
          geography_id: string | null
          approved: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          source_platform: string
          source_url?: string | null
          content_text?: string | null
          content_embed_html?: string | null
          sentiment_score?: number | null
          politician_ids?: string[] | null
          geography_id?: string | null
          approved?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          source_platform?: string
          source_url?: string | null
          content_text?: string | null
          content_embed_html?: string | null
          sentiment_score?: number | null
          politician_ids?: string[] | null
          geography_id?: string | null
          approved?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          id: string
          politician_id: string
          bill_name: string
          bill_id: string | null
          vote_date: string | null
          vote_result: string
          policy_category: string | null
          source_url: string | null
          bill_uuid: string | null
          party_vote: string | null
          created_at: string
        }
        Insert: {
          id?: string
          politician_id: string
          bill_name: string
          bill_id?: string | null
          vote_date?: string | null
          vote_result: string
          policy_category?: string | null
          source_url?: string | null
          bill_uuid?: string | null
          party_vote?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          politician_id?: string
          bill_name?: string
          bill_id?: string | null
          vote_date?: string | null
          vote_result?: string
          policy_category?: string | null
          source_url?: string | null
          bill_uuid?: string | null
          party_vote?: string | null
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          username: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          politician_id: string
          user_id: string | null
          body: string
          parent_id: string | null
          upvotes: number | null
          downvotes: number | null
          flagged: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          politician_id: string
          user_id?: string | null
          body: string
          parent_id?: string | null
          upvotes?: number | null
          downvotes?: number | null
          flagged?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          politician_id?: string
          user_id?: string | null
          body?: string
          parent_id?: string | null
          upvotes?: number | null
          downvotes?: number | null
          flagged?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      entities: {
        Row: {
          id: string
          name: string
          type: string
          description: string | null
          external_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          description?: string | null
          external_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          description?: string | null
          external_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      relationships: {
        Row: {
          id: string
          entity_a_id: string
          entity_a_type: string
          entity_b_id: string
          entity_b_type: string
          relationship_type: string
          weight: number | null
          metadata_json: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          entity_a_id: string
          entity_a_type: string
          entity_b_id: string
          entity_b_type: string
          relationship_type: string
          weight?: number | null
          metadata_json?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          entity_a_id?: string
          entity_a_type?: string
          entity_b_id?: string
          entity_b_type?: string
          relationship_type?: string
          weight?: number | null
          metadata_json?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      endorsement_log: {
        Row: {
          id: string
          politician_id: string
          previous_status: string | null
          new_status: string
          reason: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          politician_id: string
          previous_status?: string | null
          new_status: string
          reason?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          politician_id?: string
          previous_status?: string | null
          new_status?: string
          reason?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      issues: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          category?: string
          created_at?: string
        }
        Relationships: []
      }
      politician_issue_positions: {
        Row: {
          id: string
          politician_id: string
          issue_id: string
          position: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          politician_id: string
          issue_id: string
          position: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          politician_id?: string
          issue_id?: string
          position?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          id: string
          bill_id: string
          name: string
          description: string | null
          policy_category: string
          chamber: string
          congress: number | null
          introduced_date: string | null
          vote_date: string | null
          party_position_dem: string | null
          party_position_rep: string | null
          is_bipartisan: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          bill_id: string
          name: string
          description?: string | null
          policy_category: string
          chamber: string
          congress?: number | null
          introduced_date?: string | null
          vote_date?: string | null
          party_position_dem?: string | null
          party_position_rep?: string | null
          is_bipartisan?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          bill_id?: string
          name?: string
          description?: string | null
          policy_category?: string
          chamber?: string
          congress?: number | null
          introduced_date?: string | null
          vote_date?: string | null
          party_position_dem?: string | null
          party_position_rep?: string | null
          is_bipartisan?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      politician_similarities: {
        Row: {
          politician_a_id: string
          politician_b_id: string
          similarity: number
          shared_votes: number
          computed_at: string
        }
        Insert: {
          politician_a_id: string
          politician_b_id: string
          similarity: number
          shared_votes?: number
          computed_at?: string
        }
        Update: {
          politician_a_id?: string
          politician_b_id?: string
          similarity?: number
          shared_votes?: number
          computed_at?: string
        }
        Relationships: []
      }
      issue_votes: {
        Row: {
          id: string
          issue_id: string
          user_id: string | null
          vote: string
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id?: string | null
          vote: string
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string | null
          vote?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
