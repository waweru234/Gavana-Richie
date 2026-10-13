import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const DAY = 24 * 60 * 60 * 1000
const NAIROBI_OFFSET = 3 * 60 * 60 * 1000 // EAT, UTC+3, no daylight saving
const PAGE_SIZE = 1000
const MAX_ROWS = 100_000

// Calendar day in Nairobi time, e.g. "2026-10-13"
const dayKey = (iso: string | number) => new Date(new Date(iso).getTime() + NAIROBI_OFFSET).toISOString().slice(0, 10)

type Counter = Map<string, number>
const bump = (map: Counter, key: string | null | undefined, by = 1) => {
  if (!key) return
  map.set(key, (map.get(key) || 0) + by)
}
const top = (map: Counter, n = 8) =>
  Array.from(map, ([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, n)

// Supabase caps responses at 1000 rows, so page through larger ranges
async function fetchAll<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; from < MAX_ROWS; from += PAGE_SIZE) {
    const { data, error } = await build(from, from + PAGE_SIZE - 1)
    if (error) throw new Error(error.message)
    rows.push(...(data || []))
    if (!data || data.length < PAGE_SIZE) break
  }
  return rows
}

function summarizeViews(rows: { visitor_id: string | null; session_id: string | null }[]) {
  const visitors = new Set(rows.map(r => r.visitor_id).filter(Boolean)).size
  const sessions = new Set(rows.map(r => r.session_id).filter(Boolean)).size
  return { pageViews: rows.length, visitors, sessions }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = [7, 30, 90].includes(Number(searchParams.get('days'))) ? Number(searchParams.get('days')) : 30

    // Range = the last `days` Nairobi calendar days including today; previous = the same length before it
    const todayStart = new Date(`${dayKey(Date.now())}T00:00:00+03:00`).getTime()
    const start = new Date(todayStart - (days - 1) * DAY).toISOString()
    const prevStart = new Date(todayStart - (2 * days - 1) * DAY).toISOString()

    const supabase = createServerClient()

    const [views, joins, conversations, chatOpens, students, joinTotal, sources] = await Promise.all([
      fetchAll<{ created_at: string; path: string; referrer: string | null; visitor_id: string | null; session_id: string | null; device: string | null; country: string | null }>((from, to) =>
        supabase
          .from('page_views')
          .select('created_at, path, referrer, visitor_id, session_id, device, country')
          .gte('created_at', prevStart)
          .order('created_at', { ascending: true })
          .range(from, to)
      ),
      fetchAll<{ created_at: string }>((from, to) =>
        supabase.from('join_requests').select('created_at').gte('created_at', prevStart).range(from, to)
      ),
      fetchAll<{ created_at: string; first_message: string | null; message_count: number }>((from, to) =>
        supabase
          .from('chat_conversations')
          .select('created_at, first_message, message_count')
          .gte('created_at', prevStart)
          .range(from, to)
      ),
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('name', 'chat_open')
        .gte('created_at', start),
      supabase.from('students').select('sponsored'),
      supabase.from('join_requests').select('id', { count: 'exact', head: true }),
      fetchAll<{ source: string | null }>((from, to) =>
        supabase
          .from('chat_messages')
          .select('source')
          .eq('role', 'model')
          .gte('created_at', start)
          .range(from, to)
      ),
    ])

    const inRange = <T extends { created_at: string }>(rows: T[]) => rows.filter(r => r.created_at >= start)
    const inPrev = <T extends { created_at: string }>(rows: T[]) => rows.filter(r => r.created_at < start)

    const currentViews = inRange(views)
    const current = summarizeViews(currentViews)
    const previous = summarizeViews(inPrev(views))
    const currentJoins = inRange(joins)
    const currentChats = inRange(conversations)

    // Daily series, zero-filled
    const daily = new Map<string, { date: string; pageViews: number; visitors: Set<string>; joins: number; chats: number }>()
    for (let i = 0; i < days; i++) {
      const date = dayKey(todayStart - (days - 1 - i) * DAY)
      daily.set(date, { date, pageViews: 0, visitors: new Set(), joins: 0, chats: 0 })
    }
    for (const v of currentViews) {
      const d = daily.get(dayKey(v.created_at))
      if (!d) continue
      d.pageViews++
      if (v.visitor_id) d.visitors.add(v.visitor_id)
    }
    for (const j of currentJoins) {
      const d = daily.get(dayKey(j.created_at))
      if (d) d.joins++
    }
    for (const c of currentChats) {
      const d = daily.get(dayKey(c.created_at))
      if (d) d.chats++
    }

    const pages: Counter = new Map()
    const referrers: Counter = new Map()
    const devices: Counter = new Map()
    const countries: Counter = new Map()
    for (const v of currentViews) {
      bump(pages, v.path)
      bump(referrers, v.referrer || 'Direct / unknown')
      bump(devices, v.device || 'unknown')
      bump(countries, v.country || 'Unknown')
    }

    const questions: Counter = new Map()
    for (const c of currentChats) {
      const q = c.first_message?.trim().toLowerCase().replace(/[?!.\s]+$/g, '')
      if (q) bump(questions, q.length > 90 ? `${q.slice(0, 87)}…` : q)
    }

    const answerSources: Counter = new Map()
    const sourceLabels: Record<string, string> = {
      knowledge: 'Trained answers',
      gemini: 'AI (Gemini)',
      rules: 'Built-in replies',
    }
    for (const s of sources) bump(answerSources, sourceLabels[s.source || ''] || 'Other')

    const studentRows = students.data || []

    return NextResponse.json({
      range: { days, start },
      kpis: {
        ...current,
        pagesPerSession: current.sessions ? +(current.pageViews / current.sessions).toFixed(1) : 0,
        joinRequests: currentJoins.length,
        joinRequestsAllTime: joinTotal.count || 0,
        chatConversations: currentChats.length,
        chatMessages: currentChats.reduce((sum, c) => sum + (c.message_count || 0), 0),
        chatOpens: chatOpens.count || 0,
        studentsTotal: studentRows.length,
        studentsSponsored: studentRows.filter(s => s.sponsored).length,
        previous: {
          ...previous,
          joinRequests: inPrev(joins).length,
          chatConversations: inPrev(conversations).length,
        },
      },
      daily: Array.from(daily.values()).map(d => ({
        date: d.date,
        pageViews: d.pageViews,
        visitors: d.visitors.size,
        joins: d.joins,
        chats: d.chats,
      })),
      topPages: top(pages, 10),
      referrers: top(referrers),
      devices: top(devices),
      countries: top(countries),
      topQuestions: top(questions, 10),
      answerSources: top(answerSources),
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load analytics' },
      { status: 500 }
    )
  }
}
