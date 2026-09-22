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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing update ID' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Update not found' }, { status: 404 })
      }
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch update', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing update ID' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    const allowedFields = [
      'title', 'excerpt', 'content', 'featured_image_url', 'featured_video_url',
      'featured_file_url', 'media_type', 'category', 'tags', 'seo_title',
      'seo_description', 'seo_keywords', 'published', 'published_at'
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] === 'string') {
          updateData[field] = body[field].trim() || null
        } else if (Array.isArray(body[field])) {
          updateData[field] = body[field].filter(Boolean).map((t: string) => t.trim())
        } else {
          updateData[field] = body[field]
        }
      }
    }

    if (body.title) {
      updateData.slug = generateSlug(body.title)
    }

    if (body.published === true && !body.published_at) {
      updateData.published_at = new Date().toISOString()
    } else if (body.published === false) {
      updateData.published_at = null
    }

    const { data, error } = await supabase
      .from('updates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Update not found' }, { status: 404 })
      }
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Failed to update update', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing update ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('updates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Failed to delete update', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}