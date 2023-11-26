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
      games: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      moves: {
        Row: {
          action: string
          args: Json
          created_at: string
          game: number
          id: number
          storeName: string
        }
        Insert: {
          action: string
          args: Json
          created_at?: string
          game?: number
          id?: number
          storeName: string
        }
        Update: {
          action?: string
          args?: Json
          created_at?: string
          game?: number
          id?: number
          storeName?: string
        }
        Relationships: [
          {
            foreignKeyName: "moves_game_fkey"
            columns: ["game"]
            isOneToOne: false
            referencedRelation: "games"
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
