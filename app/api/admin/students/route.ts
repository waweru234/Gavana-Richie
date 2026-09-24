import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function generateSlug(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${cleanName}-${randomSuffix}`
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (published === 'true') {
      query = query.eq('published', true)
    } else if (published === 'false') {
      query = query.eq('published', false)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ data: data || [], count: count || 0 })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const requiredFields = ['name', 'school', 'need', 'paybill', 'account', 'tag', 'number']
    for (const field of requiredFields) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const slug = body.slug || generateSlug(body.name)
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('students')
      .insert({
        slug,
        name: body.name.trim(),
        school: body.school.trim(),
        need: body.need.trim(),
        paybill: body.paybill.trim(),
        account: body.account.trim(),
        image: body.image?.trim() || null,
        poster: body.poster?.trim() || null,
        tag: body.tag.trim(),
        number: body.number.trim(),
        short: body.short?.trim() || null,
        bio: Array.isArray(body.bio) ? body.bio.filter(Boolean) : [],
        sponsored: body.sponsored === true,
        sponsored_by: body.sponsoredBy?.trim() || null,
        sponsored_date: body.sponsoredDate?.trim() || null,
        sponsored_quote: body.sponsoredQuote?.trim() || null,
        published: body.published === true,
        sort_order: body.sort_order || 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A student with this slug already exists' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}