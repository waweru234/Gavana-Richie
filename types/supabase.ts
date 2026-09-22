export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      updates: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          featured_image_url: string | null
          featured_video_url: string | null
          featured_file_url: string | null
          media_type: 'image' | 'video' | 'file' | null
          category: string
          tags: string[]
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          author_id: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          featured_image_url?: string | null
          featured_video_url?: string | null
          featured_file_url?: string | null
          media_type?: 'image' | 'video' | 'file' | null
          category: string
          tags?: string[]
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          featured_image_url?: string | null
          featured_video_url?: string | null
          featured_file_url?: string | null
          media_type?: 'image' | 'video' | 'file' | null
          category?: string
          tags?: string[]
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id?: string | null
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