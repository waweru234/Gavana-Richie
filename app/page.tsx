import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteShell } from '@/components/site-shell'
import { AskMeButton } from '@/components/ask-me-button'
import { StudentImage } from '@/components/student-image'
import { getAllPublishedStudents } from '@/lib/students'
import { getPublishedUpdates } from '@/lib/updates'
import { getDirectImageUrl } from '@/lib/utils'

const siteUrl = 'https://www.gavanarichie.com'

export const metadata: Metadata = {
  title: 'Richie Githatu for Governor 2027 | Nakuru Kwetu',
  description: 'Richie Githatu and Nakuru Kwetu envision a healthier, better-governed, youth-driven, economically empowered Nakuru—built with the people, for the people.',
  keywords: ['Richie Githatu', 'Nakuru Governor 2027', 'Nakuru Kwetu', 'Adopt a Student', 'Nakuru politics'],
  authors: [{ name: 'Richie Githatu' }],
  creator: 'Richie Githatu',
  publisher: 'Nakuru Kwetu',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Richie Githatu for Governor 2027 | Nakuru Kwetu',
    description: 'A healthier, better-governed, youth-driven Nakuru, built with the people, for the people.',
    siteName: 'Nakuru Kwetu',
    images: [{ url: `${siteUrl}/richie-portrait.jpeg`, width: 1200, height: 630, alt: 'Richie Githatu' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Richie Githatu for Governor 2027 | Nakuru Kwetu',
    description: 'A healthier, better-governed, youth-driven Nakuru, built with the people, for the people.',
    images: [`${siteUrl}/richie-portrait.jpeg`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'PoliticalOrganization',
  name: 'Nakuru Kwetu — Richie Githatu for Governor 2027',
  url: siteUrl,
  logo: `${siteUrl}/richie-cutout.png`,
  image: `${siteUrl}/richie-portrait.jpeg`,
  description: 'The official campaign platform for Richie Githatu, candidate for Governor of Nakuru County in 2027.',
  sameAs: [
    'https://twitter.com/NakuruKwetu',
    'https://facebook.com/NakuruKwetu',
    'https://instagram.com/nakurukwetu',
  ],
  leader: {
    '@type': 'Person',
    name: 'Richie Githatu',
    image: `${siteUrl}/richie-portrait.jpeg`,
    jobTitle: 'Gubernatorial Candidate',
    worksFor: { '@type': 'Organization', name: 'Nakuru Kwetu' },
  },
  areaServed: { '@type': 'AdministrativeArea', name: 'Nakuru County, Kenya' },
  event: {
    '@type': 'Event',
    name: 'Nakuru County Gubernatorial Election 2027',
    startDate: '2027-08-09',
    location: { '@type': 'Place', name: 'Nakuru County, Kenya' },
  },
}

const fallbackUpdates = [
  {
    tag: 'CAMPAIGN · 14 SEP 2026',
    title: 'A Sunday word from Richie',
    excerpt: '“ADOPT-A-STUDENT. Give today. Every shilling from many people is the path that puts a child back in class.”',
    href: '/updates',
  },
  {
    tag: 'EVENT · 18 AUG 2026',
    title: 'Richie Githatu turned 30',
    excerpt: 'A community homecoming that brought people together and sharpened the work ahead for Nakuru.',
    href: '/updates',
  },
  {
    tag: 'STUDENT · AUG 2026',
    title: 'Shawn’s fees were covered',
    excerpt: 'The first Adopt-a-Student success story. Shawn Ndungu Mbugua is back in class and on track to finish his technical education.',
    href: '/students/shawn-ndungu',
  },
]

const getNeedAmount = (need: string) => {
  const amount = Number(need.replace(/[^0-9.]/g, ''))
  return Number.isFinite(amount) ? amount : 0
}

const formatUpdateDate = (date: string | null) => {
  if (!date) return 'LATEST UPDATE'
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'LATEST UPDATE'
    : parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase()
}

export default async function Home() {
  const [allStudents, updateResult] = await Promise.all([
    getAllPublishedStudents(),
    getPublishedUpdates(3),
  ])

  const featuredStudents = [...allStudents]
    .sort((a, b) => Number(a.sponsored) - Number(b.sponsored) || getNeedAmount(b.need) - getNeedAmount(a.need))
    .slice(0, 2)
  const publishedUpdates = updateResult.data.map((update) => {
    const excerpt = (update.excerpt || update.content)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return {
      tag: `${(update.category || 'UPDATE').toUpperCase()} · ${formatUpdateDate(update.published_at || update.created_at)}`,
      title: update.title,
      excerpt: excerpt.length > 220 ? `${excerpt.slice(0, 217).trimEnd()}…` : excerpt,
      href: `/updates/${update.slug}`,
    }
  })
  const recentUpdates = [...publishedUpdates, ...fallbackUpdates].slice(0, 3)

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="hero hero-richie home-hero">
        <div className="container hero-grid">
          <div className="hero-copy home-hero-copy">
            <p className="eyebrow"><i /> RICHIE GITHATU · NAKURU KWETU</p>
            <h1>OUR NAKURU.<br /><em>OUR FUTURE.</em></h1>
            <p className="hero-kicker">2027 GOVERNOR · NAKURU COUNTY</p>
            <p className="hero-text">
              A necessary vision for a healthier, better-governed, youth-driven and economically
              empowered Nakuru — built with the people, for the people.
            </p>
            <div className="hero-actions">
              <Link href="/manifesto" className="button button-primary">Learn more <span>↗</span></Link>
              <Link href="/about" className="text-link">Meet Richie Githatu <span>→</span></Link>
            </div>
          </div>

          <div className="hero-visual home-hero-visual">
            <div className="home-hero-photo-frame">
              <img
                src="/WhatsApp%20Image%202026-09-28%20at%2016.58.34.jpeg"
                alt="Nakuru residents taking part in a community walk together."
              />
            </div>
            <div className="home-hero-stamp">
              <b>NAKURU KWETU</b>
              <span>Our future, together.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="manifesto" className="home-manifesto">
        <div className="container">
          <div className="home-manifesto-intro">
            <p className="eyebrow"><i /> THE MANIFESTO</p>
            <h2>A Nakuru that works<br /><em>for everyone.</em></h2>
            <p>
              For the mama at the market, the boda rider on the road, the graduate at home, and the
              family waiting at the clinic — not just for the few.
            </p>
          </div>

          <div className="home-manifesto-grid">
            <Link href="/manifesto" className="home-manifesto-card home-manifesto-card-ideas">
              <div className="home-manifesto-card-copy">
                <p className="home-manifesto-card-label">THE AGENDA</p>
                <h3>Ideas that move people forward.</h3>
                <p>Explore the plans for jobs, education, health, and accountable leadership.</p>
                <span className="home-manifesto-card-link">Explore the manifesto <span aria-hidden="true">→</span></span>
              </div>
            </Link>

            <Link href="/updates" className="home-manifesto-card home-manifesto-card-photo">
              <img
                src="/WhatsApp%20Image%202026-09-28%20at%2016.57.04.jpeg"
                alt="Richie Githatu sharing food with a local resident during a Nakuru community visit."
                loading="lazy"
              />
              <div className="home-manifesto-card-copy">
                <p className="home-manifesto-card-label">FROM THE TRAIL</p>
                <h3>Walking the county, one ward at a time.</h3>
                <p>Listen, learn, and shape Nakuru&apos;s future together.</p>
                <span className="home-manifesto-card-link">Follow the journey <span aria-hidden="true">→</span></span>
              </div>
            </Link>

            <Link href="/updates" className="home-manifesto-card home-manifesto-card-photo">
              <img
                src="/WhatsApp%20Image%202026-09-28%20at%2020.04.39.jpeg"
                alt="Richie Githatu in conversation during a Pawa Radio interview."
                loading="lazy"
              />
              <div className="home-manifesto-card-copy">
                <p className="home-manifesto-card-label">NEWSROOM</p>
                <h3>Stories and updates from Nakuru.</h3>
                <p>See the conversations, events, and work happening across the county.</p>
                <span className="home-manifesto-card-link">Visit the newsroom <span aria-hidden="true">→</span></span>
              </div>
            </Link>

            <Link href="/donate" className="home-manifesto-card home-manifesto-card-support">
              <div className="home-manifesto-card-copy">
                <p className="home-manifesto-card-label">SUPPORT / MERCHANDISE</p>
                <h3>Keep the people-powered work moving.</h3>
                <p>Support the campaign or contact the team about campaign merchandise.</p>
                <span className="home-manifesto-card-link">Ways to support <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-jawabu">
        <div className="container home-jawabu-grid">
          <div className="home-jawabu-brand">
            <img src="/jawabu-kenya-logo.png" alt="Jawabu Kenya" loading="lazy" />
            <span>COMMUNITY PROGRAMMES</span>
          </div>
          <div className="home-jawabu-copy">
            <p className="eyebrow"><i /> JAWABU KENYA</p>
            <h2>Change begins when people can take part.</h2>
            <p>
              We believe meaningful change begins when people understand their rights, participate
              in decisions that affect them, and have the opportunity to shape their communities.
            </p>
            <div className="home-jawabu-actions">
              <Link href="/students#meet-students" className="button button-primary">
                Adopt a student <span>↗</span>
              </Link>
              <Link href="/join" className="button button-secondary">
                Community drives <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="message-nakuru" className="home-message">
        <div className="container home-message-grid">
          <div className="home-message-copy">
            <p className="eyebrow"><i /> A MESSAGE FOR NAKURU</p>
            <blockquote>
              “If you are eligible to vote, register. Your voice is your power, and your participation
              will help shape Nakuru County&apos;s future.”
            </blockquote>
            <cite>— Richie Githatu</cite>
          </div>
          <div className="home-ask-card">
            <p className="home-ask-label">ASK ME?</p>
            <h2>Have a question?</h2>
            <p>Ask about the manifesto, community drives, education support, or the campaign.</p>
            <AskMeButton />
          </div>
        </div>
      </section>

      <section id="featured-students" className="section students students-home home-students">
        <div className="container">
          <div className="section-heading" data-reveal="fade-up">
            <div>
              <p className="eyebrow"><i /> ADOPT-A-STUDENT</p>
              <h2>Students ready<br /><em>to learn.</em></h2>
            </div>
            <p>Choose a student, read their story, and use the school payment details on their profile to support them directly.</p>
          </div>

          {featuredStudents.length ? (
            <div className="student-grid" data-reveal="stagger">
              {featuredStudents.map((student) => (
                <Link
                  href={`/students/${student.slug}`}
                  className={`student-card student-card-link${student.sponsored ? ' student-card-sponsored' : ''}`}
                  key={student.id}
                >
                  <div className="student-image">
                    <StudentImage
                      src={getDirectImageUrl(student.image)}
                      alt={`${student.name} student profile`}
                      loading="lazy"
                    />
                    {student.sponsored && (
                      <span className="student-sponsored-badge">
                        <span className="student-sponsored-tick" aria-hidden="true">✓</span>
                        SPONSORED
                      </span>
                    )}
                    <span className="student-number">
                      {student.number} · {student.tag.toUpperCase()}
                    </span>
                  </div>
                  <div className="student-body">
                    <span className="label">{student.name.toUpperCase()}</span>
                    <h3>{student.school}</h3>
                    <p>{student.short || student.need}</p>
                    <div className="student-details">
                      <span>PAY BILL <b>{student.paybill}</b></span>
                      <span>ACCOUNT <b>{student.account}</b></span>
                    </div>
                    {student.sponsored ? (
                      <div className="need need-sponsored">
                        <b>✓ FULLY SPONSORED</b>
                        <span>{student.sponsoredBy ? `Covered by ${student.sponsoredBy}` : 'Already covered · read their story'}</span>
                      </div>
                    ) : (
                      <div className="need">
                        <b>{student.need}</b>
                        <span>Goal · any amount will help</span>
                      </div>
                    )}
                    <span className="card-link">
                      View {student.sponsored ? 'success story' : 'full profile'} <span>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="home-students-empty">Student profiles will appear here as they are published.</p>
          )}

          <div className="students-more-prompt" data-reveal="soft-pop">
            <div>
              <p className="eyebrow"><i /> MORE STUDENTS</p>
              <strong>Find students by school and explore the full directory.</strong>
              <span>School folders include every published student, with sponsored students shown alongside them.</span>
            </div>
            <Link href="/students#meet-students" className="button button-primary">See all students <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="section support-section home-support" data-reveal="fade-right">
        <div className="container support-grid">
          <div>
            <p className="eyebrow">SUPPORT NAKURU KWETU</p>
            <h2>Keep the people-powered work moving.</h2>
            <p>Every contribution helps the campaign keep listening, sharing its plans, and working alongside Nakuru communities.</p>
            <div className="home-support-actions">
              <Link href="/donate" className="button button-primary">Donate to the campaign <span>↗</span></Link>
              <Link href="/join" className="text-link">Join the movement <span>→</span></Link>
            </div>
          </div>
          <div className="support-visual">
            <img src="/richie-standing-cutout.png" alt="Richie Githatu standing and smiling" loading="lazy" />
            <div><strong>People-powered.</strong><br />Built together.</div>
          </div>
        </div>
      </section>

      <section className="section homepage-newsroom home-newsroom" id="newsroom" data-reveal="fade-up">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> NEWSROOM</p>
              <h2>Updates from<br /><em>around Nakuru.</em></h2>
            </div>
            <p>A few recent stories from the campaign trail and the people shaping our county.</p>
          </div>

          <div className="home-newsroom-grid">
            <Link href="/updates" className="home-newsroom-feature">
              <img
                src="/WhatsApp%20Image%202026-09-28%20at%2020.04.39.jpeg"
                alt="Richie Githatu in conversation during a Pawa Radio interview."
                loading="lazy"
              />
              <span className="home-newsroom-feature-copy">
                <b>NAKURU KWETU IN CONVERSATION</b>
                <strong>News, voices, and moments from the county.</strong>
                <span>Visit the newsroom <span aria-hidden="true">→</span></span>
              </span>
            </Link>

            <ol className="newsroom-list" data-reveal="stagger">
              {recentUpdates.map((update, index) => (
                <li className="newsroom-item" key={`${update.title}-${index}`}>
                  <span className="newsroom-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="newsroom-body">
                    <span className="newsroom-tag">{update.tag}</span>
                    <h3>{update.title}</h3>
                    <p>{update.excerpt}</p>
                  </div>
                  <Link href={update.href} className="text-link">Read it <span>→</span></Link>
                </li>
              ))}
            </ol>
          </div>

          <p className="newsroom-foot">Want the full feed? <Link href="/updates" className="text-link">See all campaign updates <span>→</span></Link></p>
        </div>
      </section>
    </SiteShell>
  )
}
