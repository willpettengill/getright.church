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
      bills: {
        Row: {
          bill_id: string
          chamber: string
          congress: number | null
          created_at: string
          description: string | null
          id: string
          introduced_date: string | null
          is_bipartisan: boolean | null
          name: string
          party_position_dem: string | null
          party_position_rep: string | null
          pastor_blurb: string | null
          policy_category: string
          slug: string | null
          vote_date: string | null
        }
        Insert: {
          bill_id: string
          chamber: string
          congress?: number | null
          created_at?: string
          description?: string | null
          id?: string
          introduced_date?: string | null
          is_bipartisan?: boolean | null
          name: string
          party_position_dem?: string | null
          party_position_rep?: string | null
          pastor_blurb?: string | null
          policy_category: string
          slug?: string | null
          vote_date?: string | null
        }
        Update: {
          bill_id?: string
          chamber?: string
          congress?: number | null
          created_at?: string
          description?: string | null
          id?: string
          introduced_date?: string | null
          is_bipartisan?: boolean | null
          name?: string
          party_position_dem?: string | null
          party_position_rep?: string | null
          pastor_blurb?: string | null
          policy_category?: string
          slug?: string | null
          vote_date?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          body: string
          created_at: string | null
          downvotes: number | null
          flagged: boolean | null
          id: string
          parent_id: string | null
          politician_id: string
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          downvotes?: number | null
          flagged?: boolean | null
          id?: string
          parent_id?: string | null
          politician_id: string
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          downvotes?: number | null
          flagged?: boolean | null
          id?: string
          parent_id?: string | null
          politician_id?: string
          upvotes?: number | null
          user_id?: string | null
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
        ]
      }
      endorsement_log: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          new_status: string
          politician_id: string
          previous_status: string | null
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status: string
          politician_id: string
          previous_status?: string | null
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_status?: string
          politician_id?: string
          previous_status?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "endorsement_log_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          created_at: string | null
          description: string | null
          external_url: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      geographies: {
        Row: {
          boundary_geojson: Json | null
          created_at: string | null
          id: string
          last_election_year: number | null
          last_result_dem_pct: number | null
          last_result_rep_pct: number | null
          name: string
          parent_id: string | null
          pastor_blurb: string | null
          political_lean: string | null
          population: number | null
          slug: string
          type: string
        }
        Insert: {
          boundary_geojson?: Json | null
          created_at?: string | null
          id?: string
          last_election_year?: number | null
          last_result_dem_pct?: number | null
          last_result_rep_pct?: number | null
          name: string
          parent_id?: string | null
          pastor_blurb?: string | null
          political_lean?: string | null
          population?: number | null
          slug: string
          type: string
        }
        Update: {
          boundary_geojson?: Json | null
          created_at?: string | null
          id?: string
          last_election_year?: number | null
          last_result_dem_pct?: number | null
          last_result_rep_pct?: number | null
          name?: string
          parent_id?: string | null
          pastor_blurb?: string | null
          political_lean?: string | null
          population?: number | null
          slug?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "geographies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "geographies"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_votes: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          user_id: string | null
          vote: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          user_id?: string | null
          vote: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          user_id?: string | null
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_votes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          pastor_blurb: string | null
          slug: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          pastor_blurb?: string | null
          slug: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          pastor_blurb?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      politician_issue_positions: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          notes: string | null
          politician_id: string
          position: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          notes?: string | null
          politician_id: string
          position: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          notes?: string | null
          politician_id?: string
          position?: string
        }
        Relationships: [
          {
            foreignKeyName: "politician_issue_positions_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "politician_issue_positions_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
      politician_similarities: {
        Row: {
          computed_at: string
          politician_a_id: string
          politician_b_id: string
          shared_votes: number
          similarity: number
        }
        Insert: {
          computed_at?: string
          politician_a_id: string
          politician_b_id: string
          shared_votes?: number
          similarity: number
        }
        Update: {
          computed_at?: string
          politician_a_id?: string
          politician_b_id?: string
          shared_votes?: number
          similarity?: number
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
          },
        ]
      }
      politicians: {
        Row: {
          aggregate_sentiment: number | null
          bipartisan_score: number | null
          blunch: boolean | null
          bio: string | null
          chamber: string | null
          consistency_score: number | null
          controversy_score: number | null
          created_at: string | null
          district_alignment_score: number | null
          donor_influence_score: number | null
          endorsement_status: string
          epstein_score: number | null
          geography_id: string | null
          geography_level: string | null
          id: string
          independence_score: number | null
          is_squid: boolean | null
          name: string
          office_held: string | null
          party: string | null
          party_line_score: number | null
          pastor_blurb: string | null
          policy_alignment: Json | null
          portrait_style: string | null
          portrait_url: string | null
          slug: string
          state_abbrev: string | null
          title: string | null
          updated_at: string | null
          years_in_office: number | null
        }
        Insert: {
          aggregate_sentiment?: number | null
          bipartisan_score?: number | null
          blunch?: boolean | null
          bio?: string | null
          chamber?: string | null
          consistency_score?: number | null
          controversy_score?: number | null
          created_at?: string | null
          district_alignment_score?: number | null
          donor_influence_score?: number | null
          endorsement_status?: string
          epstein_score?: number | null
          geography_id?: string | null
          geography_level?: string | null
          id?: string
          independence_score?: number | null
          is_squid?: boolean | null
          name: string
          office_held?: string | null
          party?: string | null
          party_line_score?: number | null
          pastor_blurb?: string | null
          policy_alignment?: Json | null
          portrait_style?: string | null
          portrait_url?: string | null
          slug: string
          state_abbrev?: string | null
          title?: string | null
          updated_at?: string | null
          years_in_office?: number | null
        }
        Update: {
          aggregate_sentiment?: number | null
          bipartisan_score?: number | null
          blunch?: boolean | null
          bio?: string | null
          chamber?: string | null
          consistency_score?: number | null
          controversy_score?: number | null
          created_at?: string | null
          district_alignment_score?: number | null
          donor_influence_score?: number | null
          endorsement_status?: string
          epstein_score?: number | null
          geography_id?: string | null
          geography_level?: string | null
          id?: string
          independence_score?: number | null
          is_squid?: boolean | null
          name?: string
          office_held?: string | null
          party?: string | null
          party_line_score?: number | null
          pastor_blurb?: string | null
          policy_alignment?: Json | null
          portrait_style?: string | null
          portrait_url?: string | null
          slug?: string
          state_abbrev?: string | null
          title?: string | null
          updated_at?: string | null
          years_in_office?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "politicians_geography_id_fkey"
            columns: ["geography_id"]
            isOneToOne: false
            referencedRelation: "geographies"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          approved: boolean | null
          content_embed_html: string | null
          content_text: string | null
          created_at: string | null
          geography_id: string | null
          id: string
          politician_ids: string[] | null
          sentiment_score: number | null
          source_platform: string
          source_url: string | null
        }
        Insert: {
          approved?: boolean | null
          content_embed_html?: string | null
          content_text?: string | null
          created_at?: string | null
          geography_id?: string | null
          id?: string
          politician_ids?: string[] | null
          sentiment_score?: number | null
          source_platform: string
          source_url?: string | null
        }
        Update: {
          approved?: boolean | null
          content_embed_html?: string | null
          content_text?: string | null
          created_at?: string | null
          geography_id?: string | null
          id?: string
          politician_ids?: string[] | null
          sentiment_score?: number | null
          source_platform?: string
          source_url?: string | null
        }
        Relationships: []
      }
      relationships: {
        Row: {
          created_at: string | null
          entity_a_id: string
          entity_a_type: string
          entity_b_id: string
          entity_b_type: string
          id: string
          metadata_json: Json | null
          relationship_type: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          entity_a_id: string
          entity_a_type: string
          entity_b_id: string
          entity_b_type: string
          id?: string
          metadata_json?: Json | null
          relationship_type: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          entity_a_id?: string
          entity_a_type?: string
          entity_b_id?: string
          entity_b_type?: string
          id?: string
          metadata_json?: Json | null
          relationship_type?: string
          weight?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          role: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          username?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          bill_id: string | null
          bill_name: string
          bill_uuid: string | null
          created_at: string | null
          id: string
          party_vote: string | null
          policy_category: string | null
          politician_id: string
          source_url: string | null
          vote_date: string | null
          vote_result: string
        }
        Insert: {
          bill_id?: string | null
          bill_name: string
          bill_uuid?: string | null
          created_at?: string | null
          id?: string
          party_vote?: string | null
          policy_category?: string | null
          politician_id: string
          source_url?: string | null
          vote_date?: string | null
          vote_result: string
        }
        Update: {
          bill_id?: string | null
          bill_name?: string
          bill_uuid?: string | null
          created_at?: string | null
          id?: string
          party_vote?: string | null
          policy_category?: string | null
          politician_id?: string
          source_url?: string | null
          vote_date?: string | null
          vote_result?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_bill_uuid_fkey"
            columns: ["bill_uuid"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_politician_id_fkey"
            columns: ["politician_id"]
            isOneToOne: false
            referencedRelation: "politicians"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
