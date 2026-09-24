'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteShell } from '@/components/site-shell'

interface StudentFormData {
  name: string
  school: string
  need: string
  paybill: string
  account: string
  image: string
  poster: string
  tag: string
  number: string
  short: string
  bio: string[]
  sponsored: boolean
  sponsoredBy: string
  sponsoredDate: string
  sponsoredQuote: string
  published: boolean
  sort_order: number
}

const INITIAL_FORM: StudentFormData = {
  name: '',
  school: '',
  need: '',
  paybill: '',
  account: '',
  image: '',
  poster: '',
  tag: '',
  number: '',
  short: '',
  bio: [],
  sponsored: false,
  sponsoredBy: '',
  sponsoredDate: '',
  sponsoredQuote: '',
  published: true,
  sort_order: 0,
}

export default function NewStudentPage() {
  const router = useRouter()
  const [form, setForm] = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (field: keyof StudentFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleBioChange = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      bio: prev.bio.map((b, i) => i === index ? value : b)
    }))
  }

  const addBio = () => {
    setForm(prev => ({ ...prev, bio: [...prev.bio, ''] }))
  }

  const removeBio = (index: number) => {
    setForm(prev => ({ ...prev, bio: prev.bio.filter((_, i) => i !== index) }))
  }

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'students')
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        handleChange('image', data.url)
        if (!form.poster) handleChange('poster', data.url)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.school.trim() || !form.need.trim() || !form.paybill.trim() || !form.account.trim() || !form.tag.trim() || !form.number.trim()) {
      setError('Name, school, need, paybill, account, tag, and number are required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bio: form.bio.filter(b => b.trim()),
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      router.push('/admin/students')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SiteShell>
      <div className="container admin-student-form">
        <div className="admin-form-header">
          <h1>New Student</h1>
          <p className="admin-subtitle">Add a student to the Adopt-a-Student programme</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-section">
              <h2>Basic Information</h2>

              <div className="form-field">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="e.g. Juliet Wambui Gichuki"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="number">Student Number *</label>
                <input
                  id="number"
                  type="text"
                  value={form.number}
                  onChange={e => handleChange('number', e.target.value)}
                  placeholder="e.g. 01"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="school">School / Institution *</label>
                <input
                  id="school"
                  type="text"
                  value={form.school}
                  onChange={e => handleChange('school', e.target.value)}
                  placeholder="e.g. MacMillan Medical Training"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="tag">Study Area / Tag *</label>
                <input
                  id="tag"
                  type="text"
                  value={form.tag}
                  onChange={e => handleChange('tag', e.target.value)}
                  placeholder="e.g. Medical training"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="need">Funding Need *</label>
                <input
                  id="need"
                  type="text"
                  value={form.need}
                  onChange={e => handleChange('need', e.target.value)}
                  placeholder="e.g. KSh 35,000"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="short">Short Description</label>
                <textarea
                  id="short"
                  value={form.short}
                  onChange={e => handleChange('short', e.target.value)}
                  placeholder="One-sentence summary shown on card"
                  rows={2}
                  maxLength={200}
                />
              </div>

              <div className="form-field">
                <label htmlFor="bio">Bio (one paragraph per line)</label>
                {form.bio.map((para, i) => (
                  <div key={i} className="bio-item">
                    <textarea
                      value={para}
                      onChange={e => handleBioChange(i, e.target.value)}
                      placeholder={`Paragraph ${i + 1}`}
                      rows={3}
                    />
                    {form.bio.length > 1 && (
                      <button type="button" className="remove-btn" onClick={() => removeBio(i)} title="Remove paragraph">×</button>
                    )}
                  </div>
                ))}
                <button type="button" className="button button-secondary small" onClick={addBio}>Add paragraph</button>
              </div>
            </div>

            <div className="form-section form-sidebar">
              <h2>Payment Details</h2>

              <div className="form-field">
                <label htmlFor="paybill">Paybill Number *</label>
                <input
                  id="paybill"
                  type="text"
                  value={form.paybill}
                  onChange={e => handleChange('paybill', e.target.value)}
                  placeholder="e.g. 522533"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="account">Account Number *</label>
                <input
                  id="account"
                  type="text"
                  value={form.account}
                  onChange={e => handleChange('account', e.target.value)}
                  placeholder="e.g. 1342298071"
                  required
                />
              </div>

              <h2>Media</h2>

              <div className="media-upload">
                <div className="media-type-tabs">
                  <button
                    type="button"
                    className={form.image ? 'active' : ''}
                    onClick={handleImageUpload}
                    disabled={uploading}
                  >
                    {form.image ? 'Change Image' : 'Upload Image'}
                  </button>
                </div>
                {uploading && <p className="upload-status">Uploading...</p>}
                {form.image && (
                  <div className="media-preview">
                    <img src={form.image} alt="Student photo preview" />
                    <button type="button" className="remove-media" onClick={() => handleChange('image', '')}>Remove</button>
                  </div>
                )}
                <div className="form-field">
                  <label htmlFor="poster">Poster Image URL</label>
                  <input
                    id="poster"
                    type="text"
                    value={form.poster}
                    onChange={e => handleChange('poster', e.target.value)}
                    placeholder="Defaults to image"
                  />
                </div>
              </div>

              <h2>Sponsorship</h2>
              <div className="form-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={form.sponsored}
                    onChange={e => handleChange('sponsored', e.target.checked)}
                  />
                  Already Sponsored
                </label>
              </div>

              {form.sponsored && (
                <>
                  <div className="form-field">
                    <label htmlFor="sponsoredBy">Sponsored By</label>
                    <input
                      id="sponsoredBy"
                      type="text"
                      value={form.sponsoredBy}
                      onChange={e => handleChange('sponsoredBy', e.target.value)}
                      placeholder="Who covered the fees"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="sponsoredDate">Sponsored Date</label>
                    <input
                      id="sponsoredDate"
                      type="text"
                      value={form.sponsoredDate}
                      onChange={e => handleChange('sponsoredDate', e.target.value)}
                      placeholder="e.g. August 2026"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="sponsoredQuote">Sponsored Quote</label>
                    <textarea
                      id="sponsoredQuote"
                      value={form.sponsoredQuote}
                      onChange={e => handleChange('sponsoredQuote', e.target.value)}
                      placeholder="What the sponsorship covered"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <h2>Publishing</h2>
              <div className="form-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => handleChange('published', e.target.checked)}
                  />
                  Publish student on website
                </label>
              </div>
              <div className="form-field">
                <label htmlFor="sort_order">Sort Order</label>
                <input
                  id="sort_order"
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={e => handleChange('sort_order', parseInt(e.target.value) || 0)}
                  placeholder="Lower numbers appear first"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="button button-secondary" onClick={() => router.back()}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Create Student'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SiteShell>
  )
}