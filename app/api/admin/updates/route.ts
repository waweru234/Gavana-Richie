import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { UpdatePost, CreateUpdatePostData } from '@/lib/update-types'

export const dynamic = 'force-dynamic'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (published === 'true') {
      query = query.eq('published', true)
    } else if (published === 'false') {
      query = query.eq('published', false)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ data, count })
  } catch (error) {
    console.error('Error fetching updates:', error)
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body: CreateUpdatePostData = await request.json()

    const slug = generateSlug(body.title)
    const now = new Date().toISOString()

    const insertData = {
      ...body,
      slug,
      created_at: now,
      updated_at: now,
      published_at: body.published ? now : null,
    }

    const { data, error } = await supabase
      .from('updates')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating update:', error)
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 })
  }
}