import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { deviceFromUserAgent } from '@/lib/chatbot'

export const dynamic = 'force-dynamic'

const BOT_RE = /bot|crawl|spider|slurp|preview|lighthouse|headless|facebookexternalhit|whatsapp/i
const ALLOWED_EVENTS = new Set(['chat_open'])

const clip = (v: unknown, max: number) => (typeof v === 'string' && v ? v.slice(0, max) : null)

function referrerHost(referrer: string | null, ownHost: string | null): string | null {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    if (ownHost && host === ownHost.replace(/^www\./, '').split(':')[0]) return null
    return host
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const ua = request.headers.get('user-agent')
  if (ua && BOT_RE.test(ua)) return new NextResponse(null, { status: 204 })

  const supabase = getSupabaseServerClient()
  if (!supabase) return new NextResponse(null, { status: 204 })

  try {
    const body = await request.json()
    const path = clip(body?.path, 300)
    if (!path || !path.startsWith('/') || path.startsWith('/admin')) {
      return new NextResponse(null, { status: 204 })
    }
    const visitor_id = clip(body?.visitorId, 64)
    const session_id = clip(body?.sessionId, 64)

    if (body?.type === 'event') {
      const name = clip(body?.name, 50)
      if (name && ALLOWED_EVENTS.has(name)) {
        await supabase.from('analytics_events').insert({ name, path, visitor_id, session_id })
      }
    } else {
      await supabase.from('page_views').insert({
        path,
        referrer: referrerHost(clip(body?.referrer, 500), request.headers.get('host')),
        visitor_id,
        session_id,
        device: deviceFromUserAgent(ua),
        country: request.headers.get('x-vercel-ip-country'),
      })
    }
  } catch (error) {
    console.error('Tracking error:', error)
  }
  return new NextResponse(null, { status: 204 })
}
