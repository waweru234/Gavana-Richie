'use client'

import { useState } from 'react'
import Link from 'next/link'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <main>
    <div className="topbar"><span>RICHIE GITHATU · 2027 GOVERNOR</span><span>Nakuru Kwetu · New Generation</span><span>Your voice. Your power.</span></div>
    <header className="nav-wrap"><nav className="nav container" aria-label="Main navigation">
      <Link href="/" className="brand" onClick={close}><img src="/logo.png" alt="Governor Richard Githatu Adopt-a-Student logo" /><span><b>RICHIE GITHATU</b><small>Nakuru Kwetu · New Generation</small></span></Link>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
      <div className={`nav-links ${open ? 'is-open' : ''}`}>
        <Link href="/about" onClick={close}>About Richie</Link><Link href="/manifesto" onClick={close}>Agenda</Link><Link href="/students" onClick={close}>Adopt a student</Link><Link href="/updates" onClick={close}>Updates</Link><Link href="/join" onClick={close}>Join</Link><Link href="/donate" className="nav-cta" onClick={close}>Support the campaign</Link>
      </div>
    </nav></header>{children}
    <footer><div className="footer-top-line" /><div className="container footer-main"><div className="footer-identity"><Link href="/" className="brand footer-brand"><img src="/logo.png" alt="Richie Githatu campaign logo" /><span><b>RICHIE GITHATU</b><small>Nakuru Kwetu · New Generation</small></span></Link><p>Richie Githatu for Governor of Nakuru County, 2027. A people-powered campaign for a county that works for everyone.</p></div><div className="footer-column"><span>EXPLORE</span><Link href="/about">About Richie</Link><Link href="/manifesto">The Agenda</Link><Link href="/students">Adopt a Student</Link></div><div className="footer-column"><span>TAKE PART</span><Link href="/join">Join the movement</Link><Link href="/donate">Support the movement</Link><Link href="/updates">Campaign updates</Link></div></div><div className="container footer-bottom"><span>© 2026 Richie Githatu for Governor · Nakuru County 032</span><span>2027 · Your voice, your choice.</span><a href="https://gavanarichie.com">gavanarichie.com</a></div></footer>
  </main>
}

export function PageIntro({ eyebrow, title, accent, text }: { eyebrow: string; title: string; accent: string; text: string }) {
  return <section className="page-intro"><div className="container page-intro-grid"><div><p className="eyebrow"><i /> {eyebrow}</p><h1>{title}<br /><em>{accent}</em></h1></div><p>{text}</p></div></section>
}

export function ActionBand({ title = 'Your KSh 10 counts.', text = 'Small support from many people creates a powerful path forward for Nakuru.' }: { title?: string; text?: string }) {
  return <section className="action-band"><div className="container action-band-inner"><div><p className="eyebrow">TAFakARI HAYO</p><h2>{title}</h2><p>{text}</p></div><Link href="/donate" className="button button-primary">Support the movement <span>↗</span></Link></div></section>
}

export function StatStrip({ items }: { items: { value: string; label: string }[] }) {
  return <section className="ribbon"><div className="container ribbon-grid">{items.map(item => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>
}
