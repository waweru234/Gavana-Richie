'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, RotateCcw, Save, Upload } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import type { HomeContent, ManifestoCard } from '@/lib/home-content'

type FieldType = 'text' | 'textarea' | 'image' | 'link'
type Field = { name: string; label: string; type?: FieldType; hint?: string }
type SectionKey = keyof HomeContent

const SECTIONS: { key: SectionKey; title: string; description: string; fields: Field[] }[] = [
  {
    key: 'hero',
    title: 'Hero',
    description: 'The first thing visitors see',
    fields: [
      { name: 'eyebrow', label: 'Small label above the title' },
      { name: 'kicker', label: 'Line under the title' },
      { name: 'title', label: 'Title, line 1' },
      { name: 'titleAccent', label: 'Title, line 2 (script style)' },
      { name: 'text', label: 'Intro paragraph', type: 'textarea' },
      { name: 'primaryCtaLabel', label: 'Main button text' },
      { name: 'primaryCtaHref', label: 'Main button link', type: 'link' },
      { name: 'secondaryCtaLabel', label: 'Second link text' },
      { name: 'secondaryCtaHref', label: 'Second link URL', type: 'link' },
      { name: 'image', label: 'Hero photo', type: 'image' },
      { name: 'imageAlt', label: 'Photo description (for screen readers)' },
      { name: 'stampTitle', label: 'Photo badge title' },
      { name: 'stampText', label: 'Photo badge text' },
    ],
  },
  {
    key: 'manifesto',
    title: 'Manifesto',
    description: 'Intro and the four cards',
    fields: [
      { name: 'eyebrow', label: 'Small label' },
      { name: 'title', label: 'Heading, line 1' },
      { name: 'titleAccent', label: 'Heading, line 2 (script style)' },
      { name: 'text', label: 'Intro paragraph', type: 'textarea' },
    ],
  },
  {
    key: 'jawabu',
    title: 'Jawabu Kenya',
    description: 'Community programmes banner',
    fields: [
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'brandLabel', label: 'Text under the logo' },
      { name: 'eyebrow', label: 'Small label' },
      { name: 'title', label: 'Heading' },
      { name: 'text', label: 'Paragraph', type: 'textarea' },
      { name: 'primaryCtaLabel', label: 'Main button text' },
      { name: 'primaryCtaHref', label: 'Main button link', type: 'link' },
      { name: 'secondaryCtaLabel', label: 'Second button text' },
      { name: 'secondaryCtaHref', label: 'Second button link', type: 'link' },
    ],
  },
  {
    key: 'message',
    title: 'Message for Nakuru',
    description: 'Quote and the "Ask me" card',
    fields: [
      { name: 'eyebrow', label: 'Small label' },
      { name: 'author', label: 'Quote author' },
      { name: 'quote', label: 'Quote (quotation marks are added for you)', type: 'textarea' },
      { name: 'askLabel', label: 'Ask card label' },
      { name: 'askTitle', label: 'Ask card heading' },
      { name: 'askText', label: 'Ask card text', type: 'textarea' },
    ],
  },
  {
    key: 'newsroom',
    title: 'Newsroom',
    description: 'Heading and feature image. The three stories come from published Updates.',
    fields: [
      { name: 'eyebrow', label: 'Small label' },
      { name: 'title', label: 'Heading, line 1' },
      { name: 'titleAccent', label: 'Heading, line 2 (script style)' },
      { name: 'text', label: 'Side text', type: 'textarea' },
      { name: 'featureImage', label: 'Feature image', type: 'image' },
      { name: 'featureImageAlt', label: 'Image description' },
      { name: 'featureLabel', label: 'Feature label' },
      { name: 'featureTitle', label: 'Feature title' },
      { name: 'featureLinkLabel', label: 'Feature link text' },
    ],
  },
  {
    key: 'donate',
    title: 'Donate banner',
    description: 'The call to support at the bottom',
    fields: [
      { name: 'eyebrow', label: 'Small label' },
      { name: 'title', label: 'Heading' },
      { name: 'text', label: 'Paragraph', type: 'textarea' },
      { name: 'buttonLabel', label: 'Button text' },
      { name: 'buttonHref', label: 'Button link', type: 'link' },
    ],
  },
]

const CARD_FIELDS: Field[] = [
  { name: 'label', label: 'Label' },
  { name: 'title', label: 'Title' },
  { name: 'text', label: 'Text', type: 'textarea' },
  { name: 'linkLabel', label: 'Link text' },
  { name: 'href', label: 'Link URL', type: 'link' },
  { name: 'image', label: 'Photo (optional — leave empty for a coloured card)', type: 'image' },
  { name: 'imageAlt', label: 'Photo description' },
]

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'homepage')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="adm-image">
      {value ? <img className="adm-image-preview" src={value} alt="" /> : <div className="adm-image-preview">No image</div>}
      <div>
        <input className="adm-input" value={value} onChange={e => onChange(e.target.value)} placeholder="/image.jpg or https://…" />
        <div className="adm-image-actions">
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        {error && <small style={{ color: 'var(--adm-bad)' }}>{error}</small>}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) upload(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

function FieldInput({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const wide = field.type === 'textarea' || field.type === 'image'
  return (
    <label className="adm-field" style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <span>{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea className="adm-textarea" value={value} onChange={e => onChange(e.target.value)} />
      ) : field.type === 'image' ? (
        <ImageInput value={value} onChange={onChange} />
      ) : (
        <input
          className="adm-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.type === 'link' ? '/page or https://…' : undefined}
        />
      )}
    </label>
  )
}

export default function HomepageEditorPage() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [defaults, setDefaults] = useState<HomeContent | null>(null)
  const [saved, setSaved] = useState<string>('')
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/content/home')
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error)
        setContent(json.data)
        setDefaults(json.defaults)
        setSaved(JSON.stringify(json.data))
      })
      .catch(err => setStatus({ kind: 'error', text: err.message || 'Failed to load content' }))
  }, [])

  const dirty = content !== null && JSON.stringify(content) !== saved

  // Warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const setField = (section: SectionKey, name: string, value: string) => {
    setStatus(null)
    setContent(prev => (prev ? { ...prev, [section]: { ...prev[section], [name]: value } } : prev))
  }

  const setCard = (index: number, name: keyof ManifestoCard, value: string) => {
    setStatus(null)
    setContent(prev => {
      if (!prev) return prev
      const cards = prev.manifesto.cards.map((c, i) => (i === index ? { ...c, [name]: value } : c))
      return { ...prev, manifesto: { ...prev.manifesto, cards } }
    })
  }

  const save = async () => {
    if (!content) return
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/admin/content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: content }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Failed to save')
      setSaved(JSON.stringify(content))
      setStatus({ kind: 'ok', text: 'Saved. The homepage is updated.' })
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const resetAll = () => {
    if (defaults && confirm('Replace every field with the original website text? You can still review before saving.')) {
      setContent(defaults)
    }
  }

  return (
    <AdminShell
      title="Homepage content"
      subtitle="Edit the text, links and images on the homepage"
      actions={
        <a href="/" target="_blank" rel="noreferrer" className="adm-btn adm-btn-ghost">
          <ExternalLink size={15} /> View homepage
        </a>
      }
    >
      {!content && !status && <div className="adm-loading">Loading content…</div>}
      {!content && status && <div className={`adm-notice adm-notice-${status.kind}`}>{status.text}</div>}

      {content &&
        SECTIONS.map((section, sectionIndex) => (
          <details key={section.key} className="adm-section" open={sectionIndex === 0}>
            <summary>
              <div>
                <b>{section.title}</b>
                <br />
                <span>{section.description}</span>
              </div>
            </summary>
            <div className="adm-section-body">
              <div className="adm-row">
                {section.fields.map(field => (
                  <FieldInput
                    key={field.name}
                    field={field}
                    value={String((content[section.key] as unknown as Record<string, unknown>)[field.name] ?? '')}
                    onChange={v => setField(section.key, field.name, v)}
                  />
                ))}
              </div>

              {section.key === 'manifesto' &&
                content.manifesto.cards.map((card, i) => (
                  <div key={i} className="adm-subcard">
                    <h3>Card {i + 1}</h3>
                    <div className="adm-row">
                      {CARD_FIELDS.map(field => (
                        <FieldInput
                          key={field.name}
                          field={field}
                          value={card[field.name as keyof ManifestoCard]}
                          onChange={v => setCard(i, field.name as keyof ManifestoCard, v)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </details>
        ))}

      {content && (
        <div className="adm-savebar">
          <span className="adm-savebar-status">
            {status ? (
              <span style={{ color: status.kind === 'ok' ? 'var(--adm-good)' : 'var(--adm-bad)' }}>{status.text}</span>
            ) : dirty ? (
              'You have unsaved changes'
            ) : (
              'All changes saved'
            )}
          </span>
          <div className="adm-toolbar">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={resetAll}>
              <RotateCcw size={15} /> Restore original text
            </button>
            <button type="button" className="adm-btn" onClick={save} disabled={saving || !dirty}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save & publish'}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
