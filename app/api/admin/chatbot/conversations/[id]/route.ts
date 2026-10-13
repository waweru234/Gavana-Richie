import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const [conversation, messages] = await Promise.all([
      supabase.from('chat_conversations').select('*').eq('id', id).maybeSingle(),
      supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true }),
    ])
    if (conversation.error || messages.error) {
      return NextResponse.json({ error: (conversation.error || messages.error)!.message }, { status: 500 })
    }
    if (!conversation.data) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    return NextResponse.json({ data: { ...conversation.data, messages: messages.data || [] } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const { error } = await supabase.from('chat_conversations').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}
