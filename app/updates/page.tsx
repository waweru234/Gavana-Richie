import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'

export default function UpdatesPage() {
  return <SiteShell>
    <PageIntro
      eyebrow="FROM THE CAMPAIGN"
      title="What is happening"
      accent="in Nakuru."
      text="Two recent moments — a Sunday word and a birthday — from the trail of Richie Githatu&apos;s 2027 campaign."
    />

    <section className="section updates-magazine">
      <div className="container">
        <div className="section-heading" data-reveal="fade-up">
          <div><p className="eyebrow"><i /> THIS WEEK</p><h2>Two recent moments<br /><em>from the trail.</em></h2></div>
          <p>One word, one moment. Updated as the campaign moves through Nakuru County.</p>
        </div>

        <div className="updates-magazine-list">
          {/* Sunday message — the most recent of the two */}
          <article className="updates-card" data-reveal="fade-up">
            <div className="updates-card-meta">
              <span className="updates-card-tag">SUNDAY · A MESSAGE</span>
              <span className="updates-card-date"><b>14</b><span>SEP 2026</span></span>
            </div>
            <div className="updates-card-image updates-card-image-message">
              <img src="/richie-message.jpeg" alt="Richie Githatu recording a Sunday word for the campaign" loading="lazy" />
            </div>
            <div className="updates-card-body">
              <h3>A Sunday word<br /><em>from Richie.</em></h3>
              <p className="updates-card-lede">A quieter word from the trail — sent weeks after the 30th-birthday homecoming, and pointed at the same truth.</p>
              <blockquote className="updates-card-quote">
                <span className="updates-card-quote-mark" aria-hidden>&ldquo;</span>
                Sunday is the day the little things get loud. Family. The neighbour who waves. The student still walking to class even though this month is tight.
                <strong> ADOPT-A-STUDENT. Give today.</strong> Every child deserves education — and every shilling from many people is the path that gets us there.
                <span className="updates-card-quote-mark" aria-hidden>&rdquo;</span>
              </blockquote>
              <p>It was sent on a Sunday afternoon, no cameras, no stage. Just a phone, a quiet room, and a reminder that the work keeps moving when the weekend begins.</p>
              <Link href="/donate" className="text-link">Stand with a student today <span>→</span></Link>
            </div>
          </article>

          {/* The birthday */}
          <article className="updates-card" data-reveal="fade-up">
            <div className="updates-card-meta">
              <span className="updates-card-tag">EVENT · 18 AUG 2026 · TURNING 30</span>
              <span className="updates-card-date"><b>18</b><span>AUG 2026</span></span>
            </div>
            <div className="updates-card-image">
              <img src="/WhatsApp Image 2026-09-17 at 08.18.39.jpeg" alt="Richie Githatu celebrating his 30th birthday with the community" loading="lazy" />
            </div>
            <div className="updates-card-body">
              <h3>Thirty, in community.<br /><em>Richie&apos;s birthday in Nakuru.</em></h3>
              <p className="updates-card-lede">Three decades shaped by Nakuru, marked by the people who shaped them.</p>
              <p>The cake was small. The room was not. On 18 August 2026, Richie Githatu turned 30 — not as a campaign moment, but as a homecoming. Family from the wider county, neighbours from his childhood ward, teachers who stayed, students still walking to class. The morning was short and the table was full.</p>
              <blockquote className="updates-card-quote">
                <span className="updates-card-quote-mark" aria-hidden>&ldquo;</span>
                I am thirty because of you. Now I want to make sure that the next thirty years of this county belong to the same kind of people who raised me.
                <span className="updates-card-quote-mark" aria-hidden>&rdquo;</span>
              </blockquote>
              <p>Three weeks later, the Sunday word above followed.</p>
              <Link href="/about" className="text-link">Meet Richie Githatu <span>→</span></Link>
            </div>
          </article>
        </div>

        <p className="updates-magazine-foot">
          Older updates from the campaign archive will return here as the trail goes on. In the meantime, follow along on socials.
        </p>
      </div>
    </section>

    {/* Sign-up / connect — small repeatable block, gentle */}
    <section className="section updates-connect" data-reveal="fade-up">
      <div className="container updates-connect-inner">
        <p className="eyebrow"><i /> STAY CLOSE</p>
        <h2>Want the next one<br /><em>in your inbox.</em></h2>
        <p>Drop your phone on the Join page and the next Sunday word will land first thing.</p>
        <Link href="/join" className="button button-primary">Join the movement <span>↗</span></Link>
      </div>
    </section>

    <ActionBand title="Stay close to the work." text="Join the movement for campaign updates, community events, and the conversations shaping Nakuru Kwetu." />
  </SiteShell>
}
