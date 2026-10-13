'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChartColumn,
  BookOpen,
  ExternalLink,
  GraduationCap,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Newspaper,
  UserPlus,
} from 'lucide-react'
import './admin.css'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: ChartColumn },
  { href: '/admin/homepage', label: 'Homepage content', icon: House },
  { href: '/admin/chatbot', label: 'Train chatbot', icon: BookOpen },
  { href: '/admin/conversations', label: 'Conversations', icon: MessagesSquare },
  { href: '/admin/updates', label: 'Updates', icon: Newspaper },
  { href: '/admin/students', label: 'Students', icon: GraduationCap },
  { href: '/admin/join-requests', label: 'Join requests', icon: UserPlus },
]

export function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="adm">
      <aside className={`adm-side ${menuOpen ? 'is-open' : ''}`}>
        <div className="adm-brand">
          <img src="/richie-cutout.png" alt="" />
          <div>
            <b>Nakuru Kwetu</b>
            <small>Admin</small>
          </div>
        </div>
        <nav className="adm-nav" aria-label="Admin">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href)
            return (
              <Link key={href} href={href} className={active ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                <Icon size={17} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="adm-side-foot">
          <Link href="/" target="_blank">
            <ExternalLink size={16} aria-hidden="true" /> View website
          </Link>
          <button type="button" onClick={logout}>
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-menu" aria-label="Open menu" onClick={() => setMenuOpen(o => !o)}>
            <Menu size={20} />
          </button>
          <div className="adm-top-copy">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="adm-top-actions">{actions}</div>}
        </header>
        <main className="adm-content">{children}</main>
      </div>
      {menuOpen && <div className="adm-scrim" onClick={() => setMenuOpen(false)} />}
    </div>
  )
}
