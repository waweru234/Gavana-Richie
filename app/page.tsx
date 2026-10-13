import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteShell } from '@/components/site-shell'
import { AskMeButton } from '@/components/ask-me-button'
import { getPublishedUpdates } from '@/lib/updates'
import { getHomeContent, type ManifestoCard } from '@/lib/home-content'

// Re-render at most every minute; CMS saves also revalidate immediately
export const revalidate = 60

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

const manifestoCardClass = (card: ManifestoCard, index: number) => {
  if (card.image) return 'home-manifesto-card-photo'
  return index === 0 ? 'home-manifesto-card-ideas' : 'home-manifesto-card-support'
}

export default async function Home() {
  const [updateResult, content] = await Promise.all([getPublishedUpdates(3), getHomeContent()])
  const { hero, manifesto, jawabu, message, newsroom, donate } = content
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
            <p className="eyebrow"><i /> {hero.eyebrow}</p>
            <h1>{hero.title}<br /><em>{hero.titleAccent}</em></h1>
            <p className="hero-kicker">{hero.kicker}</p>
            <p className="hero-text">{hero.text}</p>
            <div className="hero-actions">
              <Link href={hero.primaryCtaHref} className="button button-primary">{hero.primaryCtaLabel} <span>↗</span></Link>
              <Link href={hero.secondaryCtaHref} className="text-link">{hero.secondaryCtaLabel} <span>→</span></Link>
            </div>
          </div>

          <div className="hero-visual home-hero-visual">
            <div className="home-hero-photo-frame">
              <img src={hero.image} alt={hero.imageAlt} />
            </div>
            <div className="home-hero-stamp">
              <b>{hero.stampTitle}</b>
              <span>{hero.stampText}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="manifesto" className="home-manifesto">
        <div className="container">
          <div className="home-manifesto-intro">
            <p className="eyebrow"><i /> {manifesto.eyebrow}</p>
            <h2>{manifesto.title}<br /><em>{manifesto.titleAccent}</em></h2>
            <p>{manifesto.text}</p>
          </div>

          <div className="home-manifesto-grid">
            {manifesto.cards.map((card, index) => (
              <Link key={index} href={card.href} className={`home-manifesto-card ${manifestoCardClass(card, index)}`}>
                {card.image && <img src={card.image} alt={card.imageAlt} loading="lazy" />}
                <div className="home-manifesto-card-copy">
                  <p className="home-manifesto-card-label">{card.label}</p>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className="home-manifesto-card-link">{card.linkLabel} <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-jawabu">
        <div className="container home-jawabu-grid">
          <div className="home-jawabu-brand">
            <img src={jawabu.logo} alt="Jawabu Kenya" loading="lazy" />
            <span>{jawabu.brandLabel}</span>
          </div>
          <div className="home-jawabu-copy">
            <p className="eyebrow"><i /> {jawabu.eyebrow}</p>
            <h2>{jawabu.title}</h2>
            <p>{jawabu.text}</p>
            <div className="home-jawabu-actions">
              <Link href={jawabu.primaryCtaHref} className="button button-primary">
                {jawabu.primaryCtaLabel} <span>↗</span>
              </Link>
              <Link href={jawabu.secondaryCtaHref} className="button button-secondary">
                {jawabu.secondaryCtaLabel} <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="message-nakuru" className="home-message">
        <div className="container home-message-grid">
          <div className="home-message-copy">
            <p className="eyebrow"><i /> {message.eyebrow}</p>
            <blockquote>“{message.quote}”</blockquote>
            <cite>— {message.author}</cite>
          </div>
          <div className="home-ask-card">
            <p className="home-ask-label">{message.askLabel}</p>
            <h2>{message.askTitle}</h2>
            <p>{message.askText}</p>
            <AskMeButton />
          </div>
        </div>
      </section>

      <section className="section homepage-newsroom home-newsroom" id="newsroom" data-reveal="fade-up">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> {newsroom.eyebrow}</p>
              <h2>{newsroom.title}<br /><em>{newsroom.titleAccent}</em></h2>
            </div>
            <p>{newsroom.text}</p>
          </div>

          <div className="home-newsroom-grid">
            <Link href="/updates" className="home-newsroom-feature">
              <img src={newsroom.featureImage} alt={newsroom.featureImageAlt} loading="lazy" />
              <span className="home-newsroom-feature-copy">
                <b>{newsroom.featureLabel}</b>
                <strong>{newsroom.featureTitle}</strong>
                <span>{newsroom.featureLinkLabel} <span aria-hidden="true">→</span></span>
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

      <section className="home-donate" aria-labelledby="home-donate-title">
        <div className="container home-donate-inner">
          <div className="home-donate-copy">
            <p className="eyebrow"><i /> {donate.eyebrow}</p>
            <h2 id="home-donate-title">{donate.title}</h2>
            <p>{donate.text}</p>
          </div>
          <Link href={donate.buttonHref} className="button home-donate-button">
            {donate.buttonLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}
