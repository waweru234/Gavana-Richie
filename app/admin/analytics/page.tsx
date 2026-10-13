'use client'

import { useCallback, useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { BarList, KpiTile, TimeChart } from '@/components/admin/charts'
import type { AnalyticsData } from '@/lib/analytics-types'

const RANGES = [7, 30, 90] as const
const DEVICE_LABELS: Record<string, string> = { mobile: 'Mobile', desktop: 'Desktop', tablet: 'Tablet', unknown: 'Unknown' }

export default function AnalyticsPage() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`)
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Failed to load analytics')
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    load()
  }, [load])

  const k = data?.kpis

  return (
    <AdminShell
      title="Analytics"
      subtitle="Traction across the website, sign-ups and the campaign assistant"
      actions={
        <>
          <div className="adm-seg" role="group" aria-label="Date range">
            {RANGES.map(r => (
              <button key={r} type="button" className={days === r ? 'active' : ''} onClick={() => setDays(r)}>
                {r} days
              </button>
            ))}
          </div>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={load} disabled={loading} aria-label="Refresh">
            <RotateCcw size={15} /> Refresh
          </button>
        </>
      }
    >
      {error && (
        <div className="adm-notice adm-notice-error">
          {error}. If this is a fresh setup, run <code>supabase-admin.sql</code> in the Supabase SQL editor.
        </div>
      )}
      {loading && !data && <div className="adm-loading">Loading analytics…</div>}

      {k && data && (
        <>
          <div className="adm-kpis" style={{ opacity: loading ? 0.6 : 1 }}>
            <KpiTile label="Unique visitors" value={k.visitors} previous={k.previous.visitors} />
            <KpiTile label="Page views" value={k.pageViews} previous={k.previous.pageViews} />
            <KpiTile label="Visits (sessions)" value={k.sessions} previous={k.previous.sessions} />
            <KpiTile label="Pages per visit" value={k.pagesPerSession} hint="average" format={n => n.toFixed(1)} />
            <KpiTile label="Join requests" value={k.joinRequests} previous={k.previous.joinRequests} />
            <KpiTile label="Join requests, all time" value={k.joinRequestsAllTime} hint="total supporters signed up" />
            <KpiTile label="Chatbot conversations" value={k.chatConversations} previous={k.previous.chatConversations} />
            <KpiTile label="Students sponsored" value={k.studentsSponsored} hint={`of ${k.studentsTotal} students listed`} />
          </div>

          <section className="adm-card">
            <div className="adm-card-head">
              <div>
                <h2>Visitors per day</h2>
                <p>Unique visitors each day (Nairobi time). Hover for page views.</p>
              </div>
            </div>
            <TimeChart
              label="Visitors"
              data={data.daily.map(d => ({ date: d.date, value: d.visitors, extra: [{ label: 'page views', value: d.pageViews }] }))}
            />
          </section>

          <div className="adm-grid-2">
            <section className="adm-card">
              <div className="adm-card-head">
                <div>
                  <h2>Join requests per day</h2>
                  <p>New supporters from the Join form</p>
                </div>
              </div>
              <TimeChart kind="column" label="Join requests" height={200} data={data.daily.map(d => ({ date: d.date, value: d.joins }))} />
            </section>
            <section className="adm-card">
              <div className="adm-card-head">
                <div>
                  <h2>Chatbot conversations per day</h2>
                  <p>{k.chatOpens} chat window opens · {k.chatMessages} messages exchanged</p>
                </div>
              </div>
              <TimeChart kind="column" label="Conversations" height={200} data={data.daily.map(d => ({ date: d.date, value: d.chats }))} />
            </section>
          </div>

          <div className="adm-grid-2">
            <section className="adm-card">
              <h2>Most visited pages</h2>
              <BarList items={data.topPages} empty="No page views yet" />
            </section>
            <section className="adm-card">
              <h2>Where visitors come from</h2>
              <BarList items={data.referrers} empty="No visits yet" />
            </section>
          </div>

          <div className="adm-grid-3">
            <section className="adm-card">
              <h2>Devices</h2>
              <BarList items={data.devices.map(d => ({ ...d, label: DEVICE_LABELS[d.label] || d.label }))} empty="No visits yet" />
            </section>
            <section className="adm-card">
              <h2>Countries</h2>
              <BarList items={data.countries} empty="No visits yet" />
            </section>
            <section className="adm-card">
              <h2>How the chatbot answered</h2>
              <BarList items={data.answerSources} empty="No chatbot replies yet" />
            </section>
          </div>

          <section className="adm-card">
            <div className="adm-card-head">
              <div>
                <h2>What people ask first</h2>
                <p>Most common opening questions to the assistant. Train answers for these on the Train chatbot page.</p>
              </div>
            </div>
            <BarList items={data.topQuestions} empty="No conversations yet" />
          </section>
        </>
      )}
    </AdminShell>
  )
}
