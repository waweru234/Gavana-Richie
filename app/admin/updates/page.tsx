'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteShell } from '@/components/site-shell'

interface UpdatePost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  featured_image_url?: string
}

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<UpdatePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchUpdates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('published', filter === 'published' ? 'true' : 'false')
      const res = await fetch(`/api/admin/updates?${params}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setUpdates(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch updates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpdates()
  }, [filter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/updates/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setUpdates(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <SiteShell>
      <div className="container admin-updates">
        <div className="admin-header">
          <div>
            <h1>Updates Management</h1>
            <p className="admin-subtitle">Create and manage campaign updates</p>
          </div>
          <Link href="/admin/updates/new" className="button button-primary">
            New Update
          </Link>
        </div>

        <div className="admin-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'published' ? 'active' : ''}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
          <button
            className={filter === 'draft' ? 'active' : ''}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading updates...</div>
        ) : updates.length === 0 ? (
          <div className="admin-empty">
            <p>No updates found. <Link href="/admin/updates/new">Create your first update</Link></p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {updates.map(update => (
                  <tr key={update.id}>
                    <td className="title-cell">
                      <Link href={`/admin/updates/${update.id}/edit`}>{update.title}</Link>
                      <span className="slug-preview">/{update.slug}</span>
                    </td>
                    <td>
                      <span className="category-badge">{update.category}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${update.published ? 'published' : 'draft'}`}>
                        {update.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{formatDate(update.published_at)}</td>
                    <td>{formatDate(update.created_at)}</td>
                    <td className="actions-cell">
                      <Link href={`/admin/updates/${update.id}/edit`} className="action-btn edit">Edit</Link>
                      <Link href={`/updates/${update.slug}`} target="_blank" className="action-btn view">View</Link>
                      <button
                        className={`action-btn delete ${deletingId === update.id ? 'deleting' : ''}`}
                        onClick={() => handleDelete(update.id)}
                        disabled={deletingId === update.id}
                      >
                        {deletingId === update.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SiteShell>
  )
}