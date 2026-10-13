'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getVisitorId, newConversationId, trackEvent } from '@/lib/analytics-client'

type Msg = { role: 'user' | 'model'; text: string }

const DEFAULT_QUICK = [
  'How do I pay M-Pesa?',
  'What is Vijana na Tender?',
  'How can I adopt a student?',
]

const DEFAULT_GREETING =
  "Hi, I'm Richie Githatu's campaign assistant for the 2027 Governor race in Nakuru County. I can help with payments, the agenda, ADOPT-A-STUDENT, Vijana na Tender, Soko Bila Rent, and how to join the movement. What would you like to know?"

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function HelpAssistant() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [quick, setQuick] = useState(DEFAULT_QUICK)
  const [messages, setMessages] = useState<Msg[]>([{ role: 'model', text: DEFAULT_GREETING }])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const conversationId = useRef<string | null>(null)
  const configLoaded = useRef(false)

  // Load the greeting and suggested questions configured in the admin dashboard
  useEffect(() => {
    if (!open || configLoaded.current) return
    configLoaded.current = true
    trackEvent('chat_open')
    fetch('/api/help')
      .then(res => res.json())
      .then(data => {
        if (typeof data?.greeting === 'string' && data.greeting.trim()) {
          setMessages(prev => (prev.length === 1 ? [{ role: 'model', text: data.greeting }] : prev))
        }
        if (Array.isArray(data?.quickQuestions) && data.quickQuestions.length) setQuick(data.quickQuestions)
      })
      .catch(() => {})
  }, [open])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, sending, open])

  useEffect(() => {
    const openAssistant = () => setOpen(true)
    window.addEventListener('nakuru:open-campaign-assistant', openAssistant)
    return () => window.removeEventListener('nakuru:open-campaign-assistant', openAssistant)
  }, [])

  const send = async (text?: string) => {
    const value = (text ?? draft).trim()
    if (!value || sending) return
    setDraft('')
    const next: Msg[] = [...messages, { role: 'user', text: value }]
    setMessages(next)
    setSending(true)
    try {
      const res = await fetch('/api/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          conversationId: (conversationId.current ??= newConversationId()),
          visitorId: getVisitorId(),
          path: window.location.pathname,
        }),
      })
      const data = await res.json()
      const reply = (data?.text as string | undefined) ?? "I'm having trouble reaching my notes right now. Try again, or Reach the team via the Join form on the website."
      setMessages([...next, { role: 'model', text: reply }])
    } catch {
      setMessages([
        ...next,
        {
          role: 'model',
          text: "I couldn't reach my notes just now. Reach the team directly via the Join form or richardgithatu@gavanarichie.com.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  if (pathname?.startsWith('/admin')) return null

  return (
    <div className="help-assistant" aria-live="polite">
      {open && (
        <div className="help-panel" id="campaign-help-dialog" role="dialog" aria-label="Richie's campaign assistant">
          <div className="help-header">
            <div className="help-header-art">
              <img src="/richie-cutout.png" alt="Richie Githatu's campaign assistant" />
            </div>
            <div className="help-header-copy">
              <b>Ask Richie&apos;s campaign</b>
              <small>Powered by Gemini · Nakuru Kwetu 2027</small>
            </div>
            <button type="button" className="help-close" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
            </button>
          </div>
          <div className="help-list" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`help-bubble help-bubble-${m.role}`}>
                <p dangerouslySetInnerHTML={{ __html: escapeHtml(m.text).replace(/\n/g, '<br/>') }} />
              </div>
            ))}
            {sending && (
              <div className="help-bubble help-bubble-model help-typing">
                <span /><span /><span /> Thinking&hellip;
              </div>
            )}
          </div>
          {messages.length <= 1 && (
            <div className="help-quick">
              {quick.map(q => (
                <button key={q} type="button" className="help-quick-chip" onClick={() => send(q)} disabled={sending}>
                  {q}
                </button>
              ))}
            </div>
          )}
          <form
            className="help-form"
            onSubmit={e => {
              e.preventDefault()
              send()
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about the campaign…"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              disabled={sending}
              autoFocus={open}
            />
            <button type="submit" className="help-send" aria-label="Send" disabled={sending || !draft.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.4 21a1 1 0 0 0 1.31 1.32l18.36-7.06a1 1 0 0 0 0-1.84L3.71 6.36A1 1 0 0 0 2.4 7.69l3 6.81a1 1 0 0 0 .74.55l5.21 1.05-5.21 1.05a1 1 0 0 0-.74.55l-3 6.81Z" /></svg>
            </button>
          </form>
        </div>
      )}
      <button type="button" className="help-fab" aria-label="Open Richie's campaign assistant" onClick={() => setOpen(o => !o)}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
        ) : (
          <img src="/richie-cutout.png" alt="Open Richie's campaign assistant" />
        )}
      </button>
    </div>
  )
}
