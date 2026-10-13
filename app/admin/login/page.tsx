'use client'

import { useState } from 'react'
import '@/components/admin/admin.css'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      const next = new URLSearchParams(window.location.search).get('next')
      // Only follow same-site admin paths
      window.location.href = next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <img src="/richie-cutout.png" alt="" />
        <div>
          <h1>Admin sign in</h1>
          <p>Nakuru Kwetu campaign dashboard</p>
        </div>
        {error && <div className="adm-notice adm-notice-error">{error}</div>}
        <label className="adm-field">
          <span>Password</span>
          <input
            className="adm-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        <button type="submit" className="adm-btn" disabled={loading || !password}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
