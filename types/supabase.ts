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
      students: {
        Row: {
          id: string
          slug: string
          name: string
          school: string
          need: string
          paybill: string
          account: string
          image: string | null
          poster: string | null
          tag: string
          number: string
          short: string | null
          bio: string[] | null
          sponsored: boolean
          sponsored_by: string | null
          sponsored_date: string | null
          sponsored_quote: string | null
          published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          school: string
          need: string
          paybill: string
          account: string
          image?: string | null
          poster?: string | null
          tag: string
          number: string
          short?: string | null
          bio?: string[] | null
          sponsored?: boolean
          sponsored_by?: string | null
          sponsored_date?: string | null
          sponsored_quote?: string | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          school?: string
          need?: string
          paybill?: string
          account?: string
          image?: string | null
          poster?: string | null
          tag?: string
          number?: string
          short?: string | null
          bio?: string[] | null
          sponsored?: boolean
          sponsored_by?: string | null
          sponsored_date?: string | null
          sponsored_quote?: string | null
          published?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      join_requests: {
        Row: {
          id: string
          full_name: string
          email: string
          phone_number: string | null
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone_number?: string | null
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone_number?: string | null
          message?: string | null
          created_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: { key: string; value: Json; updated_at: string }
        Insert: { key: string; value: Json; updated_at?: string }
        Update: { key?: string; value?: Json; updated_at?: string }
        Relationships: []
      }
      page_views: {
        Row: {
          id: number
          path: string
          referrer: string | null
          visitor_id: string | null
          session_id: string | null
          device: string | null
          country: string | null
          created_at: string
        }
        Insert: PageViewInsert
        Update: Partial<PageViewInsert>
        Relationships: []
      }
      analytics_events: {
        Row: {
          id: number
          name: string
          path: string | null
          visitor_id: string | null
          session_id: string | null
          created_at: string
        }
        Insert: AnalyticsEventInsert
        Update: Partial<AnalyticsEventInsert>
        Relationships: []
      }
      chatbot_knowledge: {
        Row: {
          id: string
          question: string
          answer: string
          keywords: string[]
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: ChatbotKnowledgeInsert
        Update: Partial<ChatbotKnowledgeInsert>
        Relationships: []
      }
      chat_conversations: {
        Row: {
          id: string
          visitor_id: string | null
          path: string | null
          device: string | null
          first_message: string | null
          message_count: number
          created_at: string
          last_message_at: string
        }
        Insert: ChatConversationInsert
        Update: Partial<ChatConversationInsert>
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: number
          conversation_id: string
          role: 'user' | 'model'
          text: string
          source: string | null
          created_at: string
        }
        Insert: ChatMessageInsert
        Update: Partial<ChatMessageInsert>
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

export type PageViewInsert = {
  id?: number
  path: string
  referrer?: string | null
  visitor_id?: string | null
  session_id?: string | null
  device?: string | null
  country?: string | null
  created_at?: string
}

export type AnalyticsEventInsert = {
  id?: number
  name: string
  path?: string | null
  visitor_id?: string | null
  session_id?: string | null
  created_at?: string
}

export type ChatbotKnowledgeInsert = {
  id?: string
  question: string
  answer: string
  keywords?: string[]
  active?: boolean
  created_at?: string
  updated_at?: string
}

export type ChatConversationInsert = {
  id: string
  visitor_id?: string | null
  path?: string | null
  device?: string | null
  first_message?: string | null
  message_count?: number
  created_at?: string
  last_message_at?: string
}

export type ChatMessageInsert = {
  id?: number
  conversation_id: string
  role: 'user' | 'model'
  text: string
  source?: string | null
  created_at?: string
}
