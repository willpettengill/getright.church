export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: [
          {
            foreignKeyName: "geographies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "geographies"
            referencedColumns: ["id"]
          }
        ]
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
          created_at: string
          updated_at: string
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
          created_at?: string
          updated_at?: string
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
          created_at?: string
          updated_at?: string
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
        }
        Relationships: [
          {
            foreignKeyName: "politicians_geography_id_fkey"
            columns: ["geography_id"]
            isOneToOne: false
            referencedRelation: "geographies"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "posts_geography_id_fkey"
            columns: ["geography_id"]
            isOneToOne: false
            referencedRelation: "geographies"
            referencedColumns: ["id"]
          }
        ]
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
          created_at: string
          bill_uuid: string | null
          party_vote: string | null
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
          created_at?: string
          bill_uuid?: string | null
          party_vote?: string | null
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
          created_at?: string
          bill_uuid?: string | null
          party_vote?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_bill_uuid_fkey"
            columns: ["bill_uuid"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "comments_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "endorsement_log_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "endorsement_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "politician_issue_positions_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "politician_issue_positions_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "issue_votes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "politician_similarities_politician_a_id_fkey"
            columns: ["politician_a_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "politician_similarities_politician_b_id_fkey"
            columns: ["politician_b_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          }
        ]
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
