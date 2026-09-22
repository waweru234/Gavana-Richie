import { createServerClient } from '@/lib/supabase'

export interface UpdatePost {
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

export async function getPublishedUpdates(limit = 20, offset = 0, category?: string): Promise<{ data: UpdatePost[]; count: number }> {
  try {
    const supabase = createServerClient()
    
    let query = supabase
      .from('updates')
      .select('*', { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return { data: [], count: 0 }
    }

    return { data: (data as UpdatePost[]) || [], count: count || 0 }
  } catch (error) {
    console.error('Error fetching updates:', error)
    return { data: [], count: 0 }
  }
}

export async function getUpdateBySlug(slug: string): Promise<UpdatePost | null> {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Supabase error:', error)
      }
      return null
    }

    return data as UpdatePost
  } catch (error) {
    console.error('Error fetching update by slug:', error)
    return null
  }
}

export async function getAllUpdates(limit = 50, offset = 0, published?: boolean): Promise<{ data: UpdatePost[]; count: number }> {
  try {
    const supabase = createServerClient()
    
    let query = supabase
      .from('updates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (published !== undefined) {
      query = query.eq('published', published)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return { data: [], count: 0 }
    }

    return { data: (data as UpdatePost[]) || [], count: count || 0 }
  } catch (error) {
    console.error('Error fetching all updates:', error)
    return { data: [], count: 0 }
  }
}