import Link from 'next/link'
import { AboutVideo } from '@/components/about-video'
import { ActionBand, PageIntro, SiteShell, StatStrip } from '@/components/site-shell'
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

    <section className="section page-story" data-reveal="fade-up"><div className="container page-story-grid"><div className="page-story-art"><span className="page-story-circle" /><img src="/richie-cutout.png" alt="Richard Githatu, candidate for Governor of Nakuru County" /></div><div className="page-story-copy"><p className="eyebrow">THE PERSON BEHIND THE MOVEMENT</p><h2>Leadership that<br /><em>opens doors.</em></h2><p>Richard Githatu is running for Governor of Nakuru County in 2027 with a new-generation approach: listen first, act practically, and build opportunity into the systems that serve our people.</p></div></div></section>
    <section className="section text-section" data-reveal="fade-up"><div className="container two-col"><div><p className="eyebrow">THE VISION</p><h2>A county where<br /><em>everyone can rise.</em></h2></div><div className="prose"><p>Richard Githatu believes leadership is measured by the opportunities it creates. A student supported today can become a professional, an employer, a parent, and a stronger neighbour tomorrow.</p><p>This is a campaign for a Nakuru that invests in its people: quality education, meaningful youth opportunity, accountable public service, and communities that are proud of what they are building together.</p><Link href="/manifesto" className="button">Read the manifesto <span>↗</span></Link></div></div></section>
    <ActionBand title="Ready to build with us?" text="Every voice, every skill, and every small act of support matters." />
  </SiteShell>
}
