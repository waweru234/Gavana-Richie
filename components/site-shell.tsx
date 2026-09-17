'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SocialIcons } from './social-icons'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <main>
    <div className="topbar"><span>RICHIE GITHATU · 2027 GOVERNOR</span><span>Nakuru Kwetu · New Generation</span><span>Your voice. Your power.</span></div>
    <header className="nav-wrap">
      <nav className="nav container" aria-label="Main navigation">
        <Link href="/" className="brand" onClick={close}><img src="/richie-cutout.png" alt="Richie Githatu" /><span><b>RICHIE GITHATU</b><small>Nakuru Kwetu · New Generation</small></span></Link>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          <Link href="/about" onClick={close}>About Richie</Link><Link href="/manifesto" onClick={close}>Agenda</Link><Link href="/students" onClick={close}>Adopt a student</Link><Link href="/updates" onClick={close}>Updates</Link><Link href="/join" onClick={close}>Join</Link><Link href="/donate" className="nav-cta" onClick={close}>Support the campaign</Link>
        </div>
      </nav>
    </header>
    {children}
    <footer>
      <div className="footer-top-line" />
      <div className="container footer-main">
        <div className="footer-identity">
          <Link href="/" className="brand footer-brand"><img src="/richie-cutout.png" alt="Richie Githatu" /><span><b>RICHIE GITHATU</b><small>Nakuru Kwetu · New Generation</small></span></Link>
          <p>Richie Githatu for Governor of Nakuru County, 2027. A people-powered campaign for a county that works for everyone.</p>
          <div className="footer-contact-block">
            <p className="eyebrow"><i /> CONTACT THE CAMPAIGN</p>
            <ul className="footer-contact-list">
              <li>
                <span className="footer-contact-icon" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a14.21 14.21 0 0 0 6.38 6.38l2.13-2.13a1 1 0 0 1 1.05-.24 11.65 11.65 0 0 0 3.65.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.62a1 1 0 0 1 1 1 11.65 11.65 0 0 0 .58 3.65 1 1 0 0 1-.24 1.05l-2.34 2.09Z" /></svg>
                </span>
                <a href="tel:+254738972179">0738 972 179</a>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.46-.5 6.54 6.45 6.54-6.45H5.46Zm15.04 1-7.07 6.97a1 1 0 0 1-1.39 0L4.5 6V18.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V6Z" /></svg>
                </span>
                <a href="mailto:richardgithatu@gavanarichie.com">richardgithatu@gavanarichie.com</a>
              </li>
            </ul>
            <div className="footer-social-block">
              <p className="eyebrow"><i /> FOLLOW</p>
              <SocialIcons variant="light" size="sm" />
            </div>
          </div>
        </div>
        <div className="footer-column">
          <span>EXPLORE</span>
          <Link href="/about">About Richie</Link>
          <Link href="/manifesto">The Agenda</Link>
          <Link href="/students">Adopt a Student</Link>
        </div>
        <div className="footer-column">
          <span>TAKE PART</span>
          <Link href="/join">Join the movement</Link>
          <Link href="/donate">Support the movement</Link>
          <Link href="/updates">Campaign updates</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Richie Githatu for Governor · Nakuru County 032</span>
        <span>2027 · Your voice, your choice.</span>
        <a href="https://gavanarichie.com">gavanarichie.com</a>
      </div>
    </footer>
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
