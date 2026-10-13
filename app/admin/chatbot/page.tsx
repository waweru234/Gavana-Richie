'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Pencil, Plus, Save, Search, Send, Trash2 } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { KnowledgeModal, SOURCE_LABELS, type KnowledgeDraft, type KnowledgeRow } from '@/components/admin/knowledge-modal'
import type { ChatbotSettings } from '@/lib/chatbot'

function KnowledgeBase() {
  const [rows, setRows] = useState<KnowledgeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<KnowledgeDraft | null>(null)

  useEffect(() => {
    fetch('/api/admin/chatbot/knowledge')
      .then(res => res.json())
      .then(json => (json.error ? setError(json.error) : setRows(json.data)))
      .catch(() => setError('Failed to load answers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(r =>
      [r.question, r.answer, ...r.keywords].some(t => t.toLowerCase().includes(term))
    )
  }, [rows, search])

  const onSaved = (row: KnowledgeRow) => {
    setRows(prev => (prev.some(r => r.id === row.id) ? prev.map(r => (r.id === row.id ? row : r)) : [row, ...prev]))
    setEditing(null)
  }

  const toggle = async (row: KnowledgeRow) => {
    const res = await fetch(`/api/admin/chatbot/knowledge/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !row.active }),
    })
    const json = await res.json()
    if (json.data) onSaved(json.data)
    else alert(json.error || 'Failed to update')
  }

  const remove = async (row: KnowledgeRow) => {
    if (!confirm(`Delete the answer for "${row.question}"?`)) return
    const res = await fetch(`/api/admin/chatbot/knowledge/${row.id}`, { method: 'DELETE' })
    const json = await res.json()
    if (json.ok) setRows(prev => prev.filter(r => r.id !== row.id))
    else alert(json.error || 'Failed to delete')
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Trained answers ({rows.filter(r => r.active).length} active)</h2>
          <p>Questions and answers the assistant should always give. They also guide the AI on related questions.</p>
        </div>
        <button type="button" className="adm-btn" onClick={() => setEditing({})}>
          <Plus size={15} /> Teach an answer
        </button>
      </div>

      {rows.length > 4 && (
        <div className="adm-toolbar" style={{ marginBottom: 12 }}>
          <Search size={15} aria-hidden="true" />
          <input className="adm-input" placeholder="Search answers…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {error && <div className="adm-notice adm-notice-error">{error}</div>}
      {loading ? (
        <div className="adm-loading">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="adm-empty">
          {rows.length ? 'No answers match your search.' : 'No trained answers yet. Teach the assistant its first answer.'}
        </div>
      ) : (
        <div className="adm-kb">
          {filtered.map(row => (
            <article key={row.id} className={`adm-kb-item ${row.active ? '' : 'inactive'}`}>
              <p className="adm-kb-q">{row.question}</p>
              <p className="adm-kb-a">{row.answer}</p>
              <div className="adm-kb-meta">
                {row.keywords.map(k => (
                  <span key={k} className="adm-badge adm-badge-muted">{k}</span>
                ))}
                {!row.active && <span className="adm-badge">Paused</span>}
                <div className="adm-kb-actions">
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => toggle(row)}>
                    {row.active ? 'Pause' : 'Activate'}
                  </button>
                  <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setEditing(row)} aria-label="Edit">
                    <Pencil size={13} /> Edit
                  </button>
                  <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => remove(row)} aria-label="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && <KnowledgeModal initial={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </section>
  )
}

function SettingsCard() {
  const [settings, setSettings] = useState<ChatbotSettings | null>(null)
  const [quickText, setQuickText] = useState('')
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/chatbot')
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error)
        setSettings(json.data)
        setQuickText(json.data.quickQuestions.join('\n'))
      })
      .catch(err => setStatus({ kind: 'error', text: err.message || 'Failed to load settings' }))
  }, [])

  const update = (patch: Partial<ChatbotSettings>) => {
    setStatus(null)
    setSettings(prev => (prev ? { ...prev, ...patch } : prev))
  }

  const save = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const data = { ...settings, quickQuestions: quickText.split('\n').map(q => q.trim()).filter(Boolean).slice(0, 6) }
      const res = await fetch('/api/admin/content/chatbot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Failed to save')
      setStatus({ kind: 'ok', text: 'Settings saved' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Assistant settings</h2>
          <p>How the assistant greets people and how it should behave</p>
        </div>
      </div>
      {!settings ? (
        status ? <div className="adm-notice adm-notice-error">{status.text}</div> : <div className="adm-loading">Loading…</div>
      ) : (
        <div className="adm-form">
          <label className="adm-field">
            <span>Greeting message</span>
            <textarea className="adm-textarea" value={settings.greeting} onChange={e => update({ greeting: e.target.value })} />
          </label>
          <label className="adm-field">
            <span>Suggested questions</span>
            <textarea
              className="adm-textarea"
              value={quickText}
              onChange={e => {
                setStatus(null)
                setQuickText(e.target.value)
              }}
            />
            <small>One per line, up to 6. Shown as buttons when the chat opens.</small>
          </label>
          <label className="adm-field">
            <span>Extra instructions for the AI</span>
            <textarea
              className="adm-textarea"
              value={settings.instructions}
              onChange={e => update({ instructions: e.target.value })}
              placeholder="e.g. Always reply in Swahili if the visitor writes in Swahili. Mention the next town hall on 2 November in Naivasha."
            />
            <small>Used when the Gemini AI is answering (GEMINI_API_KEY is set).</small>
          </label>
          <label className="adm-field">
            <span>Reply when the assistant doesn&apos;t know</span>
            <textarea
              className="adm-textarea"
              value={settings.fallback}
              onChange={e => update({ fallback: e.target.value })}
              placeholder="Leave empty to use the default reply"
            />
          </label>
          <div className="adm-toolbar">
            <button type="button" className="adm-btn" onClick={save} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save settings'}
            </button>
            {status && (
              <span style={{ fontSize: 13, color: status.kind === 'ok' ? 'var(--adm-good)' : 'var(--adm-bad)' }}>{status.text}</span>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

type TestMsg = { role: 'user' | 'model'; text: string; source?: string }

function TestChat() {
  const [messages, setMessages] = useState<TestMsg[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages, sending])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    const next: TestMsg[] = [...messages, { role: 'user', text }]
    setMessages(next)
    setDraft('')
    setSending(true)
    try {
      // No conversationId is sent, so test chats are not logged as real conversations
      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, text }) => ({ role, text })) }),
      })
      const json = await res.json()
      setMessages([...next, { role: 'model', text: json.text || 'No reply', source: json.source }])
    } catch {
      setMessages([...next, { role: 'model', text: 'Could not reach the assistant.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Test the assistant</h2>
          <p>Try questions after training. Test chats are not saved.</p>
        </div>
        {messages.length > 0 && (
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setMessages([])}>
            Clear
          </button>
        )}
      </div>
      <div className="adm-tester-log adm-transcript" ref={logRef}>
        {messages.length === 0 && <div className="adm-empty">Ask something the way a visitor would.</div>}
        {messages.map((m, i) => (
          <div key={i} className={`adm-msg adm-msg-${m.role}`}>
            {m.text}
            {m.source && (
              <div className="adm-msg-meta">
                <span className={`adm-badge ${m.source === 'knowledge' ? 'adm-badge-good' : 'adm-badge-muted'}`}>
                  {SOURCE_LABELS[m.source] || m.source}
                </span>
              </div>
            )}
          </div>
        ))}
        {sending && <div className="adm-msg adm-msg-model">Thinking…</div>}
      </div>
      <form className="adm-tester-form" onSubmit={send}>
        <input className="adm-input" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a question…" />
        <button type="submit" className="adm-btn" disabled={sending || !draft.trim()} aria-label="Send">
          <Send size={15} />
        </button>
      </form>
    </section>
  )
}

export default function ChatbotTrainingPage() {
  return (
    <AdminShell title="Train the chatbot" subtitle="Teach the campaign assistant what to say, then test it">
      <KnowledgeBase />
      <div className="adm-grid-2">
        <SettingsCard />
        <TestChat />
      </div>
    </AdminShell>
  )
}
