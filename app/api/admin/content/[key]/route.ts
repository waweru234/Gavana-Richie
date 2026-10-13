import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getContent, saveContent } from '@/lib/site-content'
import { DEFAULT_HOME_CONTENT, HOME_CONTENT_KEY } from '@/lib/home-content'
import { CHATBOT_SETTINGS_KEY, DEFAULT_CHATBOT_SETTINGS } from '@/lib/chatbot'

export const dynamic = 'force-dynamic'

const DEFAULTS: Record<string, unknown> = {
  [HOME_CONTENT_KEY]: DEFAULT_HOME_CONTENT,
  [CHATBOT_SETTINGS_KEY]: DEFAULT_CHATBOT_SETTINGS,
}

type Params = { params: Promise<{ key: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { key } = await params
  if (!(key in DEFAULTS)) return NextResponse.json({ error: 'Unknown content key' }, { status: 404 })
  const data = await getContent(key, DEFAULTS[key])
  return NextResponse.json({ data, defaults: DEFAULTS[key] })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { key } = await params
  if (!(key in DEFAULTS)) return NextResponse.json({ error: 'Unknown content key' }, { status: 404 })
  try {
    const body = await request.json()
    if (typeof body?.data !== 'object' || body.data === null) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 })
    }
    await saveContent(key, body.data)
    if (key === HOME_CONTENT_KEY) revalidatePath('/')
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
