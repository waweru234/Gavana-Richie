'use client'

import { useState } from 'react'

// How a chatbot reply was produced
export const SOURCE_LABELS: Record<string, string> = {
  knowledge: 'Trained answer',
  gemini: 'AI (Gemini)',
  rules: 'Built-in reply',
}

export interface KnowledgeRow {
  id: string
  question: string
  answer: string
  keywords: string[]
  active: boolean
  created_at: string
  updated_at: string
}

export type KnowledgeDraft = Partial<Pick<KnowledgeRow, 'id' | 'question' | 'answer' | 'keywords' | 'active'>>

// Create or edit a trained chatbot answer
export function KnowledgeModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: KnowledgeDraft
  onClose: () => void
  onSaved: (row: KnowledgeRow) => void
}) {
  const [question, setQuestion] = useState(initial.question || '')
  const [answer, setAnswer] = useState(initial.answer || '')
  const [keywords, setKeywords] = useState((initial.keywords || []).join(', '))
  const [active, setActive] = useState(initial.active !== false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        initial.id ? `/api/admin/chatbot/knowledge/${initial.id}` : '/api/admin/chatbot/knowledge',
        {
          method: initial.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, answer, keywords, active }),
        }
      )
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Failed to save')
      onSaved(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
      setSaving(false)
    }
  }

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <form className="adm-modal" onClick={e => e.stopPropagation()} onSubmit={save}>
        <h2>{initial.id ? 'Edit answer' : 'Teach a new answer'}</h2>
        {error && <div className="adm-notice adm-notice-error">{error}</div>}
        <label className="adm-field">
          <span>Question people ask</span>
          <input className="adm-input" value={question} onChange={e => setQuestion(e.target.value)} required autoFocus />
        </label>
        <label className="adm-field">
          <span>Answer the assistant should give</span>
          <textarea className="adm-textarea" style={{ minHeight: 140 }} value={answer} onChange={e => setAnswer(e.target.value)} required />
        </label>
        <label className="adm-field">
          <span>Keywords</span>
          <input
            className="adm-input"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="e.g. rally, event, meeting"
          />
          <small>Comma-separated words or phrases. When a question contains these, this answer is used.</small>
        </label>
        <label className="adm-check">
          <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} /> Active (the assistant uses this answer)
        </label>
        <div className="adm-modal-actions">
          <button type="button" className="adm-btn adm-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="adm-btn" disabled={saving || !question.trim() || !answer.trim()}>
            {saving ? 'Saving…' : 'Save answer'}
          </button>
        </div>
      </form>
    </div>
  )
}
