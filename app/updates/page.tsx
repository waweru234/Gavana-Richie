import type { Metadata } from 'next'
import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'
import { UpdatesVideo } from '@/components/updates-video'

const siteUrl = 'https://www.gavanarichie.com'

export const metadata: Metadata = {
  title: 'Campaign Updates | Richie Githatu for Governor 2027',
  description: 'Latest news and updates from the Richie Githatu 2027 gubernatorial campaign trail in Nakuru County. Civic engagement, health initiatives, community events, and more.',
  keywords: ['campaign updates', 'Richie Githatu', 'Nakuru news', 'Nakuru politics 2027'],
  authors: [{ name: 'Richie Githatu' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: `${siteUrl}/updates`,
    title: 'Campaign Updates | Richie Githatu for Governor 2027',
    description: 'Latest news and updates from the Richie Githatu 2027 gubernatorial campaign trail in Nakuru County.',
    siteName: 'Nakuru Kwetu',
    images: [{ url: `${siteUrl}/richie-portrait.jpeg`, width: 1200, height: 630, alt: 'Richie Githatu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campaign Updates | Richie Githatu for Governor 2027',
    description: 'Latest news and updates from the Richie Githatu 2027 gubernatorial campaign trail in Nakuru County.',
    images: [`${siteUrl}/richie-portrait.jpeg`],
  },
  alternates: {
    canonical: `${siteUrl}/updates`,
  },
}

export default function UpdatesPage() {
  return <SiteShell>
    <PageIntro
      eyebrow="FROM THE CAMPAIGN"
      title="What is happening"
      accent="in Nakuru."
      text="Six recent moments — Richie on the Uwazi Festival stage, a frontline look at the KNH cardiac surgery camp, trees being cut down on a busy Nakuru street, a community engagement with Wanavijiji, a Sunday word, and a birthday — from the trail of Richie Githatu&apos;s 2027 campaign."
    />

    <section className="section updates-magazine">
      <div className="container">
        <div className="section-heading" data-reveal="fade-up">
          <div><p className="eyebrow"><i /> THIS WEEK</p><h2>Six recent moments<br /><em>from the trail.</em></h2></div>
          <p>One stage, one hospital, one street, one cooperative, one word, one birthday. Updated as the campaign moves through Nakuru County.</p>
        </div>

        <div className="updates-magazine-list">
          {/* Uwazi Festival — most recent */}
          <article className="updates-card updates-card-uwazi" data-reveal="fade-up">
            <div className="updates-card-meta">
              <span className="updates-card-tag">CIVIC · 22 SEP 2026 · PAWA RADIO</span>
              <span className="updates-card-date"><b>22</b><span>SEP 2026</span></span>
            </div>
            <div className="updates-card-body">
              <h3>Richie joins the <em>Uwazi Festival</em> panel at Rift Valley Sports Club — &ldquo;Which Way Kenya?&rdquo;</h3>
              <p className="updates-card-lede">Pawa Radio&apos;s live civic forum brought together voices from across Nakuru to debate the country&apos;s direction. Richie, wearing the Nakuru Kwetu badge, took the mic to speak on governance, youth participation, and why local leadership must answer to the people — not power.</p>

              <div className="updates-video-wrap" data-reveal="soft-pop">
                <UpdatesVideo
                  src="/AQPFI_2lV5XeSLrXUCkB-VW-BOJVWKXb7-vCnHqkJ_1mWBM6OCog28LOoqNBf5RxYaKuG0s6syXUP3y19vJXgwTTRWcyeM1qLhaMaWFK0g.mp4"
                  poster="/WhatsApp Image 2026-09-20 at 14.37.52.jpeg"
                  caption="Richie Githatu on the Uwazi Festival panel &middot; Pawa Radio live at Rift Valley Sports Club, Nakuru"
                />
              </div>

              <blockquote className="updates-card-quote">
                <span className="updates-card-quote-mark" aria-hidden>&ldquo;</span>
                We are not waiting for permission to build the Nakuru we deserve. The power to change things is already in our hands — it&apos;s called showing up.
                <span className="updates-card-quote-mark" aria-hidden>&rdquo;</span>
                <cite>&mdash; Richie Githatu</cite>
              </blockquote>

              <p>The &ldquo;Which Way Kenya?&rdquo; theme cuts to the heart of what this campaign is about: citizens refusing to be spectators. From the cost of living to the state of our streets, from healthcare access to youth unemployment — the answers don&apos;t come from Nairobi. They come from communities organizing, asking hard questions, and demanding accountability.</p>

              <p>Richie shared the stage with fellow panelists in a lively back-and-forth that turned a talk show into a town hall. The energy in the room was the point: when people speak freely, the conversation shifts from problems to possibilities.</p>

              <Link href="/manifesto" className="text-link">Read the civic engagement agenda <span>→</span></Link>
            </div>
          </article>

          {/* KNH Cardiac Surgery Camp — second most recent */}
          <article className="updates-card updates-card-knh" data-reveal="fade-up">
            <div className="updates-card-meta">
              <span className="updates-card-tag">HEALTH · 21 SEP 2026 · KNH & KIHF</span>
              <span className="updates-card-date"><b>21</b><span>SEP 2026</span></span>
            </div>
            <div className="updates-card-body">
              <h3>Kenyatta National Hospital hosts a 10-day Specialist Cardiac Surgery Camp with Kibos International Health Foundation.</h3>
              <p className="updates-card-lede">From 20–30 September 2026, a visiting team of cardiac surgeons and cardiologists from Japan, the US, Canada, Sweden and the UAE — led by Professor Hiroshi Niinami of Tokyo Women&apos;s Medical University — will perform open-heart and other cardiac surgeries at KNH in partnership with the Kibos International Health Foundation (KIHF).</p>

              <div className="updates-video-wrap" data-reveal="soft-pop">
                <UpdatesVideo
                  src="/WhatsApp Video 2026-09-21 at 07.23.17.mp4"
                  poster="/WhatsApp Image 2026-09-20 at 14.37.52.jpeg"
                  caption="Dr. Gladys Njihia, Cardiologist and Head of Cardiology at KNH, on the mission &middot; filmed around the hospital grounds"
                />
              </div>

              <blockquote className="updates-card-quote">
                <span className="updates-card-quote-mark" aria-hidden>&ldquo;</span>
                This is the first of many such collaborations. We want to build the skills of our own cardiac surgeons and cardiologists so we can keep offering this care.
                <span className="updates-card-quote-mark" aria-hidden>&rdquo;</span>
                <cite>&mdash; Dr. Gladys Njihia</cite>
              </blockquote>

              <p><b>What the mission covers:</b></p>
              <ul className="programs-list">
                <li><b>Procedures:</b> bypass surgery and heart valve repair or replacement.</li>
                <li><b>Cost:</b> World-class care &ldquo;quite affordable&rdquo; for patients enrolled in SHA (Social Health Authority) — the government insurance scheme. (The Standard reports the camp as free; confirm eligibility directly with KNH cardiology.)</li>
                <li><b>Coordination:</b> cardiologists, cardiothoracic surgeons, perfusionists, laboratory, blood transfusion unit, and radiology — each team aligned through extensive pre-mission planning.</li>
                <li><b>Long-term aim:</b> ongoing partnership with KIHF so KNH builds sustainable local capacity for advanced cardiovascular care.</li>
              </ul>

              <p>If you or someone you know may be eligible, contact KNH&apos;s Cardiology Department directly to confirm enrollment and next steps. This is the kind of specialist care that should be available in every county — not only when a visiting mission arrives.</p>

              <Link href="/manifesto" className="text-link">Read the health agenda for Nakuru <span>→</span></Link>
            </div>
          </article>

          {/* Trees of Nakuru — second most recent */}
          <article className="updates-card updates-card-trees" data-reveal="fade-up">
            <div className="updates-card-meta">
              <span className="updates-card-tag">FIELD · 20 SEP 2026 · THE GREEN CITY</span>
              <span className="updates-card-date"><b>20</b><span>SEP 2026</span></span>
            </div>
            <div className="updates-card-body">
              <h3>The trees are coming down on a busy Nakuru street.<br /><em>Who is signing the permits?</em></h3>
              <p className="updates-card-lede">A 1:24 vlog from the trail &mdash; trees being cut down along a popular Nakuru street, a fresh tree trunk broken off the stump, and a concrete hoarding that reads &ldquo;NO HAWKERS.&rdquo; Below it, a 2026-built structure is going up where the avenue used to be.</p>

              <div className="updates-video-wrap" data-reveal="soft-pop">
                <UpdatesVideo
                  src="/trees-update.mp4"
                  fallbackSrc="/IMG_5180.MOV"
                  poster="/WhatsApp Image 2026-09-20 at 14.37.52.jpeg"
                  caption="Selfie vlog, 20 Sep 2026 &middot; vertical phone footage from the trail"
                />
              </div>

              <blockquote className="updates-card-quote">
                <span className="updates-card-quote-mark" aria-hidden>&ldquo;</span>
                So we&apos;re here in Nakuru, on a very popular street &hellip; This is what&apos;s happening &hellip; it&apos;s truly unfortunate.
                What made this street beautiful is &hellip; basically, being in Nakuru was all about the trees, and the beauty, and the greenness of the county.
                Basically, this is what&apos;s happening in Nakuru &hellip; what we&apos;re missing &hellip; guys are cutting down trees to make for construction.
                So what does this all mean? Something that was a proud thing in Nakuru, which is our Green City, slowly turning into stuff being made for these guys.
                That&apos;s what&apos;s happening right now. <strong>Now is the time to act. It&apos;s already almost too late.</strong>
                So if we don&apos;t act now, the situation&apos;s only gonna get worse.
                <span className="updates-card-quote-mark" aria-hidden>&rdquo;</span>
              </blockquote>

              <p>&ldquo;Nakuru &mdash; the Green City.&rdquo; That is how the county has been marketed for decades: on billboards, on tourism brochures, on rally podiums. The trees on this avenue &mdash; and on hundreds of streets like it &mdash; were not ornamental. They were shade, they were air, they were the reason Nakuru sat comfortably in climate books. They were a public good.</p>
              <p>Under the outgoing governor, that public good is being quietly auctioned. Trees that took forty years to grow are being knocked down in a single afternoon so a perimeter wall can sit a metre closer to the road. The hoarding is already going up &mdash; blue, steel, &ldquo;NO HAWKERS&rdquo; &mdash; and behind it, the rebar is already climbing. No public participation notice. No Environment Impact Assessment report on the website. No replanting commitment. Just stumps, sawdust, and silence.</p>

              <p><b>What needs to happen now:</b></p>
              <ul className="programs-list">
                <li><b>County government</b> &mdash; publish the list of streets where trees have been felled in the last 24 months, with permits, project names, and the replanting commitments attached to each one.</li>
                <li><b>NEMA</b> &mdash; audit the avenuetrees and concrete-hoarding projects before the next rainy season; any developer removing a mature tree without a 1-for-10 replanting guarantee should be required to replant on the same verge before the foundation closes.</li>
                <li><b>Residents</b> &mdash; photograph every stump on your street, share it with the county environment office and with us, and ask for the permit number attached to the felling.</li>
                <li><b>Ward representatives</b> &mdash; demand a public hearing before any further felling in your ward. Nakuru&apos;s Tree-Planting &amp; Beautification Act must not be remembered only at election time.</li>
              </ul>

              <p>A county administration that loses its trees in its last term cannot ask the next generation to plant them. The Green City cannot be rebuilt in a single rainy season after a decade of chainsaws. The outgoing governor is signing off on a Nakuru we do not want our children to inherit.</p>
              <p>The video is &mdash; by Richie&apos;s own admission &mdash; rough: phone footage, no studio, captions and all. But the stumps in frame are not rough. They are what Nakuru is becoming under the watch of a governor who will leave office knowing exactly what his last term took from this county.</p>

              <Link href="/manifesto" className="text-link">Read the agenda for a green Nakuru <span>→</span></Link>
            </div>
          </article>

          {/* Wanavijiji engagement — second most recent */}
          <article className="updates-card updates-card-wanavijiji" data-reveal="fade-up">
            <div className="updates-card-meta">
              <span className="updates-card-tag">ENGAGEMENT · 17 SEP 2026 · WANAVIJIJI</span>
              <span className="updates-card-date"><b>17</b><span>SEP 2026</span></span>
            </div>
            <div className="updates-card-image updates-card-image-wanavijiji">
              <img src="/wanavijiji-1.jpg" alt="Richie Githatu with Wanavijiji Housing Cooperative Society members during a solidarity engagement in Nakuru" loading="lazy" />
            </div>
            <div className="updates-card-body">
              <h3>With <em>Wanavijiji</em> Housing Cooperative, bringing warmth where it is needed most.</h3>
              <p className="updates-card-lede">Nakuru Wanavijiji Housing Cooperative Society hosted Richie at a community engagement where 30 needy members received blankets — and the host took time to walk through one member group and the housing construction site.</p>
              <blockquote className="updates-card-quote">
                <span className="updates-card-quote-mark" aria-hidden>&ldquo;</span>
                Today, Nakuru Wanavijiji Housing Cooperative Society was honoured to host Richard Githatu of Nakuru Ni Yetu, a gubernatorial aspirant, in a meaningful engagement with our community.
                <br /><br />
                As a gesture of solidarity and compassion, Mr. Githatu donated blankets to 30 needy Wanavijiji members, bringing warmth, hope and encouragement to families in need.
                <br /><br />
                He also had an opportunity to visit one of our members&apos; groups, engage with the community, and later tour our housing construction site. He was impressed by what Wanavijiji members are achieving through unity, commitment, savings and collective action.
                <span className="updates-card-quote-mark" aria-hidden>&rdquo;</span>
              </blockquote>
              <p>&ldquo;Our journey is a powerful reminder that when ordinary people come together with a shared vision, they can create extraordinary change. From saving together to building homes together, Wanavijiji continues to demonstrate that community power can transform lives and restore dignity.&rdquo;</p>
              <p>The cooperative is now asking for the next layer of support: building materials and mattresses. That call sits under Jawabu Kenya — see the <Link href="/students" className="text-link">ADOPT-A-STUDENT &middot; Jawabu Kenya</Link> page for how to contribute.</p>
              <Link href="/updates" className="text-link">See more updates from the campaign <span>→</span></Link>
            </div>
          </article>

          {/* Sunday message — the second most recent */}
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
