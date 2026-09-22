'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SiteShell } from '@/components/site-shell'
import { UpdatePostFormData } from '@/lib/update-types'

const CATEGORIES = [
  'HEALTH', 'CIVIC', 'FIELD', 'EVENT', 'EDUCATION', 'ECONOMY', 'GOVERNANCE', 'ENVIRONMENT', 'YOUTH', 'OTHER'
]

const INITIAL_FORM: UpdatePostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image_url: '',
  featured_video_url: '',
  featured_file_url: '',
  media_type: null,
  category: 'CIVIC',
  tags: [],
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  published: false,
  published_at: '',
}

export default function NewUpdatePage() {
  const router = useRouter()
  const [form, setForm] = useState<UpdatePostFormData>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const handleChange = (field: keyof UpdatePostFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'title' && !form.slug) {
      setForm(prev => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTagAdd = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handleMediaUpload = async (type: 'image' | 'video' | 'file') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'updates')
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setForm(prev => ({
          ...prev,
          media_type: type,
          [`featured_${type}_url`]: data.url,
        }))
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
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError('Title, excerpt, and content are required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      router.push('/admin/updates')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SiteShell>
      <div className="container admin-update-form">
        <div className="admin-form-header">
          <h1>New Update</h1>
          <p className="admin-subtitle">Create a new campaign update</p>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-section">
              <h2>Content</h2>

              <div className="form-field">
                <label htmlFor="title">Title *</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="Enter update title"
                  required
                />
                <div className="slug-preview">
                  <label>Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => handleChange('slug', e.target.value)}
                    placeholder="auto-generated from title"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="excerpt">Excerpt *</label>
                <textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={e => handleChange('excerpt', e.target.value)}
                  placeholder="Brief summary for cards and SEO"
                  rows={3}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  value={form.content}
                  onChange={e => handleChange('content', e.target.value)}
                  placeholder="Full update content (Markdown supported)"
                  rows={15}
                  required
                />
              </div>

              <div className="form-field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Tags</label>
                <div className="tags-input">
                  <div className="tag-chips">
                    {form.tags.map(tag => (
                      <span key={tag} className="tag-chip">
                        {tag}
                        <button type="button" onClick={() => handleTagRemove(tag)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-row">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                      placeholder="Add tag, press Enter"
                    />
                    <button type="button" onClick={handleTagAdd}>Add</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section form-sidebar">
              <h2>Media</h2>

              <div className="media-upload">
                <div className="media-type-tabs">
                  <button
                    type="button"
                    className={form.media_type === 'image' ? 'active' : ''}
                    onClick={() => handleMediaUpload('image')}
                    disabled={uploading}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    className={form.media_type === 'video' ? 'active' : ''}
                    onClick={() => handleMediaUpload('video')}
                    disabled={uploading}
                  >
                    Video
                  </button>
                  <button
                    type="button"
                    className={form.media_type === 'file' ? 'active' : ''}
                    onClick={() => handleMediaUpload('file')}
                    disabled={uploading}
                  >
                    File
                  </button>
                </div>

                {form.featured_image_url && form.media_type === 'image' && (
                  <div className="media-preview">
                    <img src={form.featured_image_url} alt="Preview" />
                    <button type="button" className="remove-media" onClick={() => handleChange('featured_image_url', '')}>Remove</button>
                  </div>
                )}
                {form.featured_video_url && form.media_type === 'video' && (
                  <div className="media-preview">
                    <video src={form.featured_video_url} controls />
                    <button type="button" className="remove-media" onClick={() => handleChange('featured_video_url', '')}>Remove</button>
                  </div>
                )}
                {form.featured_file_url && form.media_type === 'file' && (
                  <div className="media-preview file-preview">
                    <span>📎 {form.featured_file_url.split('/').pop()}</span>
                    <button type="button" className="remove-media" onClick={() => handleChange('featured_file_url', '')}>Remove</button>
                  </div>
                )}
              </div>

              <h2>SEO</h2>
              <div className="form-field">
                <label htmlFor="seo_title">SEO Title</label>
                <input
                  id="seo_title"
                  type="text"
                  value={form.seo_title}
                  onChange={e => handleChange('seo_title', e.target.value)}
                  placeholder="Defaults to title"
                  maxLength={60}
                />
                <small>{(form.seo_title || '').length}/60 chars</small>
              </div>
              <div className="form-field">
                <label htmlFor="seo_description">SEO Description</label>
                <textarea
                  id="seo_description"
                  value={form.seo_description}
                  onChange={e => handleChange('seo_description', e.target.value)}
                  placeholder="Defaults to excerpt"
                  rows={3}
                  maxLength={160}
                />
                <small>{(form.seo_description || '').length}/160 chars</small>
              </div>
              <div className="form-field">
                <label htmlFor="seo_keywords">SEO Keywords</label>
                <input
                  id="seo_keywords"
                  type="text"
                  value={form.seo_keywords}
                  onChange={e => handleChange('seo_keywords', e.target.value)}
                  placeholder="Comma-separated keywords"
                />
              </div>

              <h2>Publishing</h2>
              <div className="form-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => handleChange('published', e.target.checked)}
                  />
                  Publish immediately
                </label>
              </div>

              {form.published && (
                <div className="form-field">
                  <label htmlFor="published_at">Publish Date</label>
                  <input
                    id="published_at"
                    type="datetime-local"
                    value={form.published_at}
                    onChange={e => handleChange('published_at', e.target.value)}
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="button button-secondary" onClick={() => router.back()}>
                  Cancel
                </button>
                <button type="submit" className="button button-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Create Update'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SiteShell>
  )
}