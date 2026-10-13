import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cleanKeywords } from '@/lib/chatbot'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const update: { question?: string; answer?: string; keywords?: string[]; active?: boolean } = {}
    if (typeof body?.question === 'string') update.question = body.question.trim()
    if (typeof body?.answer === 'string') update.answer = body.answer.trim()
    if (body?.keywords !== undefined) update.keywords = cleanKeywords(body.keywords)
    if (typeof body?.active === 'boolean') update.active = body.active
    if (update.question === '' || update.answer === '') {
      return NextResponse.json({ error: 'Question and answer cannot be empty' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('chatbot_knowledge')
      .update(update)
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const { error } = await supabase.from('chatbot_knowledge').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}
