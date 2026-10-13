import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cleanKeywords } from '@/lib/chatbot'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: data || [] })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const question = String(body?.question || '').trim()
    const answer = String(body?.answer || '').trim()
    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are both required' }, { status: 400 })
    }
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .insert({ question, answer, keywords: cleanKeywords(body?.keywords), active: body?.active !== false })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}
