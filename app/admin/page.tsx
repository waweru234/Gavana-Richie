'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChartColumn, GraduationCap, House, MessagesSquare, Newspaper, UserPlus } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { KpiTile, TimeChart } from '@/components/admin/charts'
import type { AnalyticsData } from '@/lib/analytics-types'

const LINKS = [
  { href: '/admin/analytics', icon: ChartColumn, title: 'Analytics', text: 'Visitors, sign-ups and chatbot use over time.' },
  { href: '/admin/homepage', icon: House, title: 'Homepage content', text: 'Edit the homepage text, buttons and images.' },
  { href: '/admin/chatbot', icon: BookOpen, title: 'Train chatbot', text: 'Teach the assistant answers and set its tone.' },
  { href: '/admin/conversations', icon: MessagesSquare, title: 'Conversations', text: 'Read what people are asking the assistant.' },
  { href: '/admin/updates', icon: Newspaper, title: 'Updates', text: 'Write and publish campaign news.' },
  { href: '/admin/students', icon: GraduationCap, title: 'Students', text: 'Manage Adopt-a-Student profiles.' },
  { href: '/admin/join-requests', icon: UserPlus, title: 'Join requests', text: 'See who signed up to join the movement.' },
]

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/analytics?days=7')
      .then(res => res.json())
      .then(json => (json.error ? setError(json.error) : setData(json)))
      .catch(() => setError('Could not load stats'))
  }, [])

  return (
    <AdminShell title="Dashboard" subtitle="Last 7 days at a glance">
      {error && (
        <div className="adm-notice adm-notice-error">
          {error}. If this is a fresh setup, run <code>supabase-admin.sql</code> in the Supabase SQL editor.
        </div>
      )}

      <div className="adm-kpis">
        <KpiTile label="Visitors" value={data?.kpis.visitors ?? 0} previous={data?.kpis.previous.visitors} />
        <KpiTile label="Page views" value={data?.kpis.pageViews ?? 0} previous={data?.kpis.previous.pageViews} />
        <KpiTile label="Join requests" value={data?.kpis.joinRequests ?? 0} previous={data?.kpis.previous.joinRequests} />
        <KpiTile label="Chatbot conversations" value={data?.kpis.chatConversations ?? 0} previous={data?.kpis.previous.chatConversations} />
      </div>

      <section className="adm-card">
        <div className="adm-card-head">
          <div>
            <h2>Daily visitors</h2>
            <p>Unique visitors per day, Nairobi time</p>
          </div>
          <Link href="/admin/analytics" className="adm-btn adm-btn-ghost adm-btn-sm">Full analytics →</Link>
        </div>
        {data ? (
          <TimeChart
            label="Visitors"
            data={data.daily.map(d => ({ date: d.date, value: d.visitors, extra: [{ label: 'page views', value: d.pageViews }] }))}
          />
        ) : (
          !error && <div className="adm-loading">Loading…</div>
        )}
      </section>

      <div className="adm-links">
        {LINKS.map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={href} className="adm-link">
            <Icon size={20} aria-hidden="true" />
            <b>{title}</b>
            <span>{text}</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
