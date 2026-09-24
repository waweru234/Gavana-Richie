import type { Metadata } from 'next'
import Link from 'next/link'
import { AboutVideo } from '@/components/about-video'
import { SocialIcons } from '@/components/social-icons'
import { ActionBand, PageIntro, SiteShell, StatStrip } from '@/components/site-shell'

const siteUrl = 'https://www.gavanarichie.com'

export const metadata: Metadata = {
  title: 'About Richie Githatu | Nakuru Kwetu 2027',
  description: 'Learn about Richie Githatu, candidate for Governor of Nakuru County in 2027. A new-generation leader shaped by Nakuru, focused on education, youth opportunity, and accountable governance.',
  keywords: ['Richie Githatu', 'Nakuru Governor candidate', 'about Richie Githatu', 'Nakuru politics'],
  authors: [{ name: 'Richie Githatu' }],
  robots: 'index, follow',
  openGraph: {
    type: 'profile',
    url: `${siteUrl}/about`,
    title: 'About Richie Githatu | Nakuru Kwetu 2027',
    description: 'Learn about Richie Githatu, candidate for Governor of Nakuru County in 2027.',
    siteName: 'Nakuru Kwetu',
    images: [{ url: `${siteUrl}/richie-portrait.jpeg`, width: 1200, height: 630, alt: 'Richie Githatu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Richie Githatu | Nakuru Kwetu 2027',
    description: 'Learn about Richie Githatu, candidate for Governor of Nakuru County in 2027.',
    images: [`${siteUrl}/richie-portrait.jpeg`],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
}

export default function AboutPage() {
  return <SiteShell>
    <PageIntro eyebrow="ABOUT RICHARD GITHATU" title="Leadership with" accent="a practical heart." text="A campaign shaped by listening, service, and the belief that Nakuru can lead with ideas that touch real lives." />
    <StatStrip items={[{value:'EDUCATION',label:'as a foundation'}, {value:'YOUTH',label:'as a priority'}, {value:'NAKURU',label:'as our home'}, {value:'ACTION',label:'over promises'}]} />

    <section className="section about-video-section">
      <span className="about-video-glow" aria-hidden />
      <div className="container about-video-container" data-reveal="fade-up">
        <div className="about-video-meta">
          <span className="about-video-meta-tag">June 2024</span>
          <span className="about-video-meta-tag">Nakuru County</span>
          <span className="about-video-meta-tag">Finance Bill Protests</span>
        </div>
        <div className="section-heading">
          <div>
            <p className="eyebrow"><i /> NAKURU · JUNE 2024</p>
            <h2>What happened<br /><em>in Nakuru.</em></h2>
          </div>
          <p>In June 2024, when Kenyans took to the streets to protest the Finance Bill, lives were lost and families shattered in Nakuru County. We must remember — and we must build a county where it never happens again.</p>
        </div>
        <p className="about-video-eyebrow">A short edit on the cost of bad governance. Press play, and ask what we are going to do differently.</p>
        <div className="about-video-frame-wrapper">
          <span className="about-video-frame-corner tl" aria-hidden />
          <span className="about-video-frame-corner tr" aria-hidden />
          <span className="about-video-frame-corner bl" aria-hidden />
          <span className="about-video-frame-corner br" aria-hidden />
          <AboutVideo src="/WhatsApp Video 2026-09-17 at 06.26.29.mp4" />
        </div>
        <p className="about-video-caption">Footage: the streets of Nakuru during the June 2024 Finance Bill protests — when Kenyans stood up for their future and paid the cost for a county that forgot them.</p>
        <div className="about-video-actions">
          <Link href="/manifesto" className="button">Read the policy response <span>↗</span></Link>
          <Link href="/students" className="text-link" style={{ color: 'rgba(255,255,255,.7)' }}>Stand with the students <span>→</span></Link>
        </div>
        <p className="about-video-attribution">A Richie Githatu 2027 documentary edit · Nakuru Kwetu</p>
      </div>
    </section>

    <section className="section page-story" data-reveal="fade-up"><div className="container page-story-grid"><div className="page-story-art"><span className="page-story-circle" /><img src="/richie-main.png" alt="Richard Githatu, candidate for Governor of Nakuru County" /></div><div className="page-story-copy"><p className="eyebrow">THE PERSON BEHIND THE MOVEMENT</p><h2>Leadership that<br /><em>opens doors.</em></h2><p>Richard Githatu is running for Governor of Nakuru County in 2027 with a new-generation approach: listen first, act practically, and build opportunity into the systems that serve our people.</p><p>Turning <strong>30</strong> on 18 August 2026 — shaped by Nakuru, now stepping forward to lead it.</p></div></div></section>

    <section className="section page-story page-story-quiet" data-reveal="fade-up"><div className="container page-story-grid"><div className="page-story-copy"><p className="eyebrow">A QUIET MOMENT</p><h2>Listening first,<br /><em>then acting.</em></h2><p>Every pillar on the agenda came out of a conversation with the people of Nakuru — market women, boda-boda riders, ward elders, teachers, students, and small-business owners. Richie Githatu&apos;s job is to listen first, then turn what the county says into practical county action.</p><p>That kind of leadership does not announce itself. It shows up, opens doors, and stays until the work is done.</p></div><div className="page-story-art"><span className="page-story-circle" /><img src="/richie-seated-cutout.png" alt="Richie Githatu seated and listening" /></div></div></section>

    <section className="section text-section" data-reveal="fade-up"><div className="container two-col"><div><p className="eyebrow">THE VISION</p><h2>A county where<br /><em>everyone can rise.</em></h2></div><div className="prose"><p>Richard Githatu believes leadership is measured by the opportunities it creates. A student supported today can become a professional, an employer, a parent, and a stronger neighbour tomorrow.</p><p>This is a campaign for a Nakuru that invests in its people: quality education, meaningful youth opportunity, accountable public service, and communities that are proud of what they are building together.</p><Link href="/manifesto" className="button">Read the manifesto <span>↗</span></Link></div></div></section>

    <section className="section about-moments-strip" data-reveal="fade-up">
      <div className="container">
        <div className="about-moments-pill">
          <span className="about-moments-eyebrow">RECENT</span>
          <span className="about-moments-dot" aria-hidden>·</span>
          <span>Richie Githatu turned <b>30</b> on <b>18 AUG 2026</b></span>
          <span className="about-moments-dot" aria-hidden>·</span>
          <span>A Sunday message followed on <b>14 SEP 2026</b> — &ldquo;ADOPT-A-STUDENT. Give today.&rdquo;</span>
          <Link href="/updates" className="text-link">See both on the Updates page <span>→</span></Link>
        </div>
      </div>
    </section>

    <section className="section about-contact" data-reveal="fade-up">
      <div className="container">
        <div className="section-heading">
          <div><p className="eyebrow"><i /> CONTACT</p><h2>Reach the campaign<br /><em>directly.</em></h2></div>
          <p>Call, email, or follow on socials — every channel is owned by the campaign team. Replies within 24 hours on weekdays.</p>
        </div>
        <div className="about-contact-grid">
          <article className="about-contact-card">
            <span className="about-contact-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.46-.5 6.54 6.45 6.54-6.45H5.46Zm15.04 1-7.07 6.97a1 1 0 0 1-1.39 0L4.5 6V18.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V6Z" /></svg>
            </span>
            <b>Email</b>
            <a href="mailto:richardgithatu@gavanarichie.com">Email the campaign</a>
            <small>Replies within 24 hours · Mon–Sat</small>
          </article>
          <article className="about-contact-card">
            <span className="about-contact-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.46-.5 6.54 6.45 6.54-6.45H5.46Zm15.04 1-7.07 6.97a1 1 0 0 1-1.39 0L4.5 6V18.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V6Z" /></svg>
            </span>
            <b>Press &amp; Media</b>
            <a href="mailto:richardgithatu@gavanarichie.com">richardgithatu@gavanarichie.com</a>
            <small>For media, partnership, or volunteer enquiries</small>
          </article>
          <article className="about-contact-card about-contact-socials-card">
            <b>Socials</b>
            <SocialIcons variant="navy" size="lg" />
            <small>Tag your posts with <b>@gavanarichie</b></small>
          </article>
        </div>
      </div>
    </section>
    <ActionBand title="Ready to build with us?" text="Every voice, every skill, and every small act of support matters." />
  </SiteShell>
}
