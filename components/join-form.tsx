'use client'

import { useState } from 'react'

const constituencies = [
  'Bahati Constituency',
  'Gilgil Constituency',
  'Kuresoi North Constituency',
  'Kuresoi South Constituency',
  'Molo Constituency',
  'Naivasha Constituency',
  'Nakuru Town East Constituency',
  'Nakuru Town West Constituency',
  'Njoro Constituency',
  'Rongai Constituency',
  'Subukia Constituency',
]

type FormState = { name: string; phone: string; email: string; constituency: string }

const initial: FormState = { name: '', phone: '', email: '', constituency: '' }

const steps = [
  { n: '01', label: 'You' },
  { n: '02', label: 'Where' },
  { n: '03', label: 'Done' },
]

export function JoinForm() {
  const [location, setLocation] = useState<'inside' | 'outside' | ''>('')
  const [form, setForm] = useState<FormState>(initial)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({ name: false, phone: false, email: false, constituency: false })

  const update = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }
  const blur = (key: keyof FormState) => setTouched(prev => ({ ...prev, [key]: true }))

  const canSubmit = form.name.trim() && form.phone.trim() && location === 'inside' ? form.constituency.trim() : location === 'outside'

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 700)
  }

  if (submitted) {
    return (
      <div className="join-form-card join-form-success">
        <div className="join-form-success-art" aria-hidden>
          <div className="join-form-success-tick">✓</div>
        </div>
        <span className="join-form-tag join-form-tag-success">Welcome</span>
        <h3>You&apos;re in, {form.name ? form.name.split(' ')[0] : 'friend'}.</h3>
        <p className="join-form-success-lede">Your details are with the local coordinator{location === 'inside' ? ` for ${form.constituency || 'your constituency'}` : ''}. They&apos;ll be in touch within 24 hours — usually sooner.</p>

        <ul className="join-form-summary">
          <li><b>NAME</b><span>{form.name || '—'}</span></li>
          <li><b>PHONE</b><span>{form.phone || '—'}</span></li>
          <li><b>EMAIL</b><span>{form.email || '— (no email)'}</span></li>
          <li><b>LOCATION</b><span>{location === 'inside' ? `Inside Nakuru · ${form.constituency || '— pick a constituency'}` : 'Outside Nakuru'}</span></li>
        </ul>

        <div className="join-form-next-block">
          <p className="eyebrow"><i /> WHAT HAPPENS NEXT</p>
          <ol className="join-form-next-list">
            <li><span>01</span><div><strong>Your coordinator introduces themselves.</strong><small>A short WhatsApp hello from the local lead for your area.</small></div></li>
            <li><span>02</span><div><strong>You choose how to take part.</strong><small>Volunteer time, share the agenda, adopt a student, or simply attend the next rally.</small></div></li>
            <li><span>03</span><div><strong>You hear from Richie next Sunday.</strong><small>The next Sunday word is shared with everyone on the list first.</small></div></li>
          </ol>
        </div>

        <div className="join-form-success-actions">
          <a href="/updates" className="text-link">See what&apos;s next on the campaign <span>→</span></a>
          <button type="button" className="button button-secondary" onClick={() => { setSubmitted(false); setForm(initial); setLocation(''); setTouched({ name: false, phone: false, email: false, constituency: false }) }}>
            Add another person →
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="join-form-card" onSubmit={onSubmit} noValidate>
      <div className="join-form-card-top">
        <span className="join-form-tag">JOIN THE MOVEMENT</span>
        <p className="join-form-greeting">Hello — tell us where you are and we&apos;ll take it from there.</p>
      </div>

      <ol className="join-form-stepper" aria-label="Form progress">
        {steps.map(s => (
          <li key={s.n} className="join-form-step">
            <span>{s.n}</span>
            <small>{s.label}</small>
          </li>
        ))}
      </ol>

      <h3>Tell us where<br /><em>to find you.</em></h3>
      <p className="join-form-lede">Your name, a phone number we can reach, and your constituency if you call Nakuru home. Email is optional.</p>

      {/* 1. YOUR DETAILS */}
      <fieldset className="join-form-fieldset join-form-fieldset-details">
        <legend>01 · Your details</legend>
        <div className="join-form-row">
          <label className={'join-form-field' + (touched.name && !form.name.trim() ? ' is-error' : '')}>
            <span>Your full name <em className="req">required</em></span>
            <input
              type="text"
              required
              name="name"
              autoComplete="name"
              placeholder="e.g. Mary Wanjiku"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              onBlur={() => blur('name')}
            />
            {touched.name && !form.name.trim() && <small className="join-form-error">We need a name to greet you.</small>}
          </label>
          <label className={'join-form-field' + (touched.phone && !form.phone.trim() ? ' is-error' : '')}>
            <span>Phone number <em className="req">required</em></span>
            <input
              type="tel"
              required
              name="phone"
              autoComplete="tel"
              placeholder="07XX XXX XXX"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              onBlur={() => blur('phone')}
              inputMode="tel"
            />
            {touched.phone && !form.phone.trim() && <small className="join-form-error">A phone we can reach is required.</small>}
            {form.phone.trim() && <small className="join-form-help">WhatsApp-friendly · 24-hr reply</small>}
          </label>
        </div>

        <label className="join-form-field">
          <span>Email address <em className="opt">optional</em></span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => update('email', e.target.value)}
          />
          <small className="join-form-help">Only used for the Sunday word + rally invites.</small>
        </label>
      </fieldset>

      {/* 2. YOUR LOCATION */}
      <fieldset className="join-form-fieldset join-form-fieldset-location">
        <legend>02 · Where do you live?</legend>
        <div className="join-form-segmented">
          <button
            type="button"
            className={'join-form-segment' + (location === 'inside' ? ' is-active' : '')}
            onClick={() => setLocation('inside')}
            role="radio"
            aria-checked={location === 'inside'}
          >
            <span className="join-form-segment-dot" aria-hidden>●</span>
            <strong>Inside Nakuru</strong>
            <small>11 constituencies</small>
          </button>
          <button
            type="button"
            className={'join-form-segment' + (location === 'outside' ? ' is-active' : '')}
            onClick={() => { setLocation('outside'); update('constituency', '') }}
            role="radio"
            aria-checked={location === 'outside'}
          >
            <span className="join-form-segment-dot" aria-hidden>●</span>
            <strong>Outside Nakuru</strong>
            <small>Diaspora · abroad · other</small>
          </button>
        </div>

        {location === 'inside' && (
          <label className={'join-form-field join-form-field-anim' + (touched.constituency && !form.constituency ? ' is-error' : '')}>
            <span>Which constituency? <em className="req">required</em></span>
            <select
              name="constituency"
              value={form.constituency}
              onChange={e => update('constituency', e.target.value)}
              onBlur={() => blur('constituency')}
            >
              <option value="">Select your constituency</option>
              {constituencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {touched.constituency && !form.constituency && <small className="join-form-error">Pick the constituency you call home.</small>}
          </label>
        )}
      </fieldset>

      {/* 3. SUBMIT */}
      <div className="join-form-actions">
        <button
          type="submit"
          className="join-form-submit"
          disabled={!canSubmit || submitting}
        >
          <span className="join-form-submit-label">
            {submitting ? 'Sending…' : 'Join the movement'}
          </span>
          <span className="join-form-submit-arrow" aria-hidden>→</span>
        </button>
        <p className="join-form-fine">Your details stay with the campaign team · no third parties · deletes on request.</p>
      </div>
    </form>
  )
}
