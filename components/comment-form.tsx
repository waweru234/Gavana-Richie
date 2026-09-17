'use client'

import { useRef } from 'react'

export function CommentForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    const note = f.elements.namedItem('note') as HTMLTextAreaElement | null
    const name = f.elements.namedItem('sender') as HTMLInputElement | null
    if (!note || !note.value.trim()) return
    if (successRef.current) {
      successRef.current.innerHTML = `<strong>Note received${name?.value ? ` from ${name.value.split(' ')[0]}` : ''}. Thank you.</strong><span>Your message has been queued for the team. Replies come within 24 hours via the channels below.</span>`
    }
    if (note) note.value = ''
    if (name) name.value = ''
  }
  return (
    <form ref={formRef} className="donate-comment-form" onSubmit={onSubmit}>
      <label className="donate-comment-field">
        <span>Your name <em className="req">required</em></span>
        <input type="text" required name="sender" placeholder="e.g. Wanjiku Kariuki" />
      </label>
      <label className="donate-comment-field">
        <span>Your message <em className="req">required</em></span>
        <textarea required name="note" rows={4} placeholder="Mzee, nimetuma KSh 10 — na nimeongea na mtu wangu wa mtaa…" />
      </label>
      <div className="donate-comment-actions">
        <button type="submit" className="button button-primary">Send the note <span>↗</span></button>
        <p className="donate-comment-fine">Or reach us directly below — WhatsApp, email, socials.</p>
      </div>
      <div ref={successRef} className="donate-comment-success" aria-live="polite" />
    </form>
  )
}
