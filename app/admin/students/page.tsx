'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiteShell } from '@/components/site-shell'

interface Student {
  id: string
  slug: string
  name: string
  school: string
  tag: string
  number: string
  need: string
  paybill: string
  account: string
  sponsored: boolean
  published: boolean
  sort_order: number
  created_at: string
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'sponsored'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter === 'published') params.set('published', 'true')
      else if (filter === 'draft') params.set('published', 'false')
      const res = await fetch(`/api/admin/students?${params}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStudents(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [filter])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStudents(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSponsoredToggle = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsored: !current }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStudents(prev => prev.map(s => s.id === id ? { ...s, sponsored: !current } : s))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <SiteShell>
      <div className="container admin-students">
        <div className="admin-header">
          <div>
            <h1>Adopt-a-Student</h1>
            <p className="admin-subtitle">Manage students in the Adopt-a-Student programme</p>
          </div>
          <Link href="/admin/students/new" className="button button-primary">
            Add Student
          </Link>
        </div>

        <div className="admin-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'published' ? 'active' : ''} onClick={() => setFilter('published')}>Active</button>
          <button className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>Drafts</button>
          <button className={filter === 'sponsored' ? 'active' : ''} onClick={() => setFilter('sponsored')}>Sponsored</button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="admin-empty">
            <p>No students found. <Link href="/admin/students/new">Add your first student</Link></p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>School</th>
                  <th>Tag</th>
                  <th>Need</th>
                  <th>Sponsored</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.number}</td>
                    <td>
                      <Link href={`/students/${student.slug}`} target="_blank" className="title-cell">
                        {student.name}
                      </Link>
                    </td>
                    <td>{student.school}</td>
                    <td><span className="category-badge">{student.tag}</span></td>
                    <td>{student.need || '—'}</td>
                    <td>
                      <button
                        className={`sponsor-toggle ${student.sponsored ? 'sponsored' : ''}`}
                        onClick={() => handleSponsoredToggle(student.id, student.sponsored)}
                        title={student.sponsored ? 'Click to un-sponsor' : 'Click to mark sponsored'}
                      >
                        {student.sponsored ? '✓ Sponsored' : '○ Not sponsored'}
                      </button>
                    </td>
                    <td>
                      <span className={`status-badge ${student.published ? 'published' : 'draft'}`}>
                        {student.published ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td>{formatDate(student.created_at)}</td>
                    <td className="actions-cell">
                      <Link href={`/admin/students/${student.id}/edit`} className="action-btn edit">Edit</Link>
                      <button
                        className={`action-btn delete ${deletingId === student.id ? 'deleting' : ''}`}
                        onClick={() => handleDelete(student.id, student.name)}
                        disabled={deletingId === student.id}
                      >
                        {deletingId === student.id ? 'Deleting...' : 'Delete'}
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