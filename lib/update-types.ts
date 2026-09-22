export interface UpdatePost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url?: string
  featured_video_url?: string
  featured_file_url?: string
  media_type: 'image' | 'video' | 'file' | null
  category: string
  tags: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  author_id?: string
}

export interface CreateUpdatePostData {
  title: string
  excerpt: string
  content: string
  featured_image_url?: string
  featured_video_url?: string
  featured_file_url?: string
  media_type?: 'image' | 'video' | 'file' | null
  category: string
  tags: string[]
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  published: boolean
  published_at?: string
}

export interface UpdatePostFormData extends CreateUpdatePostData {
  slug: string
}