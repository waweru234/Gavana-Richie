'use client'

import { useCallback, useEffect, useState } from 'react'
import { GraduationCap, Search, Trash2 } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { KnowledgeModal, SOURCE_LABELS, type KnowledgeDraft } from '@/components/admin/knowledge-modal'

interface Conversation {
  id: string
  visitor_id: string | null
  path: string | null
  device: string | null
  first_message: string | null
  message_count: number
  created_at: string
  last_message_at: string
}

interface Message {
  id: number
  role: 'user' | 'model'
  text: string
  source: string | null
  created_at: string
}

const PAGE = 40

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default function ConversationsPage() {
  const [list, setList] = useState<Conversation[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<(Conversation & { messages: Message[] }) | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [teaching, setTeaching] = useState<KnowledgeDraft | null>(null)
  const [taught, setTaught] = useState(false)

  const load = useCallback(
    async (offset = 0) => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ limit: String(PAGE), offset: String(offset) })
        if (query) params.set('q', query)
        const res = await fetch(`/api/admin/chatbot/conversations?${params}`)
        const json = await res.json()
        if (!res.ok || json.error) throw new Error(json.error || 'Failed to load conversations')
        setList(prev => (offset ? [...prev, ...json.data] : json.data))
        setCount(json.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations')
      } finally {
        setLoading(false)
      }
    },
    [query]
  )

  useEffect(() => {
    load(0)
  }, [load])

  const open = async (id: string) => {
    setLoadingDetail(true)
    setTaught(false)
    try {
      const res = await fetch(`/api/admin/chatbot/conversations/${id}`)
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Failed to load conversation')
      setSelected(json.data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load conversation')
    } finally {
      setLoadingDetail(false)
    }
  }

  const remove = async () => {
    if (!selected || !confirm('Delete this conversation permanently?')) return
    const res = await fetch(`/api/admin/chatbot/conversations/${selected.id}`, { method: 'DELETE' })
    const json = await res.json()
    if (!json.ok) return alert(json.error || 'Failed to delete')
    setList(prev => prev.filter(c => c.id !== selected.id))
    setCount(c => c - 1)
    setSelected(null)
  }

  const teachFrom = (index: number) => {
    if (!selected) return
    const reply = selected.messages[index]
    const question = [...selected.messages.slice(0, index)].reverse().find(m => m.role === 'user')
    setTeaching({ question: question?.text || '', answer: reply.text })
  }

  return (
    <AdminShell title="Conversations" subtitle="What visitors are asking the campaign assistant">
      <div className="adm-convos">
        <section className="adm-card">
          <form
            className="adm-toolbar"
            style={{ marginBottom: 12 }}
            onSubmit={e => {
              e.preventDefault()
              setQuery(search.trim())
            }}
          >
            <Search size={15} aria-hidden="true" />
            <input
              className="adm-input"
              style={{ flex: 1 }}
              placeholder="Search messages…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          <p className="adm-card-sub" style={{ marginBottom: 8 }}>
            {count} conversation{count === 1 ? '' : 's'}
            {query && <> matching “{query}” · <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setSearch(''); setQuery('') }}>Clear</button></>}
          </p>
          {error && <div className="adm-notice adm-notice-error">{error}</div>}
          {!loading && !error && list.length === 0 && (
            <div className="adm-empty">{query ? 'No conversations match.' : 'No conversations yet. They appear here as visitors use the chat.'}</div>
          )}
          <div className="adm-convo-list">
            {list.map(c => (
              <button
                key={c.id}
                type="button"
                className={`adm-convo-item ${selected?.id === c.id ? 'active' : ''}`}
                onClick={() => open(c.id)}
              >
                <p>{c.first_message || '(no message)'}</p>
                <small>
                  {when(c.last_message_at)} · {Math.ceil(c.message_count / 2)} question{c.message_count > 2 ? 's' : ''}
                  {c.device ? ` · ${c.device}` : ''}
                </small>
              </button>
            ))}
            {loading && <div className="adm-loading">Loading…</div>}
            {!loading && list.length < count && (
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => load(list.length)}>
                Load more
              </button>
            )}
          </div>
        </section>

        <section className="adm-card">
          {loadingDetail ? (
            <div className="adm-loading">Loading conversation…</div>
          ) : !selected ? (
            <div className="adm-empty">Select a conversation to read it.</div>
          ) : (
            <>
              <div className="adm-card-head">
                <div>
                  <h2>Conversation</h2>
                  <p>
                    Started {when(selected.created_at)}
                    {selected.path ? ` on ${selected.path}` : ''}
                    {selected.device ? ` · ${selected.device}` : ''}
                  </p>
                </div>
                <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={remove}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
              {taught && <div className="adm-notice adm-notice-ok" style={{ marginBottom: 12 }}>Answer saved. The assistant will use it from now on.</div>}
              <div className="adm-transcript">
                {selected.messages.map((m, i) => (
                  <div key={m.id} className={`adm-msg adm-msg-${m.role}`}>
                    {m.text}
                    <div className="adm-msg-meta">
                      <time>{when(m.created_at)}</time>
                      {m.role === 'model' && (
                        <>
                          {m.source && (
                            <span className={`adm-badge ${m.source === 'knowledge' ? 'adm-badge-good' : 'adm-badge-muted'}`}>
                              {SOURCE_LABELS[m.source] || m.source}
                            </span>
                          )}
                          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => teachFrom(i)}>
                            <GraduationCap size={13} /> Teach a better answer
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {teaching && (
        <KnowledgeModal
          initial={teaching}
          onClose={() => setTeaching(null)}
          onSaved={() => {
            setTeaching(null)
            setTaught(true)
          }}
        />
      )}
    </AdminShell>
  )
}
