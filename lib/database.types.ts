
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
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          shipping_address: Json
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items: Json
          shipping_address: Json
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          shipping_address?: Json
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          description: string
          id: string
          imageUrl: string
          name: string
          price: number
          store_id: string
        }
        Insert: {
          description: string
          id?: string
          imageUrl: string
          name: string
          price: number
          store_id: string
        }
        Update: {
          description?: string
          id?: string
          imageUrl?: string
          name?: string
          price?: number
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          email: string
          id: string
          role: "super-admin" | "manager"
        }
        Insert: {
          email: string
          id: string
          role: "super-admin" | "manager"
        }
        Update: {
          email?: string
          id?: string
          role?: "super-admin" | "manager"
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stores: {
        Row: {
          description: string
          id: string
          imageUrl: string
          manager_id: string | null
          name: string
        }
        Insert: {
          description: string
          id?: string
          imageUrl: string
          manager_id?: string | null
          name: string
        }
        Update: {
          description?: string
          id?: string
          imageUrl?: string
          manager_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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