import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100)
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')

    let query = supabase
      .from('updates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (published === 'true') {
      query = query.eq('published', true)
    } else if (published === 'false') {
      query = query.eq('published', false)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch updates', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [], count: count || 0 })
  } catch (error) {
    console.error('Error fetching updates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const requiredFields = ['title', 'excerpt', 'content', 'category']
    for (const field of requiredFields) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const slug = generateSlug(body.title)
    const now = new Date().toISOString()

    const insertData = {
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt.trim(),
      content: body.content.trim(),
      featured_image_url: body.featured_image_url?.trim() || null,
      featured_video_url: body.featured_video_url?.trim() || null,
      featured_file_url: body.featured_file_url?.trim() || null,
      media_type: body.media_type || null,
      category: body.category.trim().toUpperCase(),
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean).map((t: string) => t.trim()) : [],
      seo_title: body.seo_title?.trim() || null,
      seo_description: body.seo_description?.trim() || null,
      seo_keywords: body.seo_keywords?.trim() || null,
      published: body.published === true,
      created_at: now,
      updated_at: now,
      published_at: body.published === true ? now : null,
    }

    const { data, error } = await supabase
      .from('updates')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An update with this title already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to create update', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}