import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)
    const search = searchParams.get('q')?.trim()

    const supabase = createServerClient()
    let query = supabase
      .from('chat_conversations')
      .select('*', { count: 'exact' })
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      // Find conversations where any message mentions the search term
      const { data: hits } = await supabase
        .from('chat_messages')
        .select('conversation_id')
        .ilike('text', `%${search.replace(/[%_]/g, '')}%`)
        .limit(500)
      const ids = Array.from(new Set((hits || []).map(h => h.conversation_id)))
      if (!ids.length) return NextResponse.json({ data: [], count: 0 })
      query = query.in('id', ids)
    }

    const { data, error, count } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: data || [], count: count || 0 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}
