import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')

    if (slug) {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Update not found' }, { status: 404 })
        }
        console.error('Supabase error:', error)
        return NextResponse.json({ error: 'Failed to fetch update' }, { status: 500 })
      }

      return NextResponse.json({ data })
    }

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
      return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [], count: count || 0 })
  } catch (error) {
    console.error('Error fetching updates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}