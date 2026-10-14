import type { Metadata } from 'next'
import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'
import { UpdatesVideo } from '@/components/updates-video'
import { getPublishedUpdates, type UpdatePost } from '@/lib/updates'
import { stripToText } from '@/lib/markdown'

// Updates come from Supabase. Re-render at least every minute; admin saves also revalidate immediately.
export const revalidate = 60

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

function dateParts(update: UpdatePost) {
  const date = new Date(update.published_at || update.created_at)
  if (Number.isNaN(date.getTime())) return null
  return {
    day: date.toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'Africa/Nairobi' }),
    monthYear: date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'Africa/Nairobi' }).toUpperCase(),
    full: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Africa/Nairobi' }).toUpperCase(),
  }
}

function UpdateCard({ update }: { update: UpdatePost }) {
  const date = dateParts(update)
  const href = `/updates/${update.slug}`
  const lede = update.excerpt?.trim() || stripToText(update.content).slice(0, 280)

  return (
    <article className="updates-card" data-reveal="fade-up">
      <div className="updates-card-meta">
        <span className="updates-card-tag">
          {(update.category || 'UPDATE').toUpperCase()}
          {date ? ` · ${date.full}` : ''}
        </span>
        {date && (
          <span className="updates-card-date"><b>{date.day}</b><span>{date.monthYear}</span></span>
        )}
      </div>

      {update.featured_image_url && !update.featured_video_url && (
        <Link href={href} className="updates-card-image">
          <img src={update.featured_image_url} alt={update.title} loading="lazy" />
        </Link>
      )}

      <div className="updates-card-body">
        <h3><Link href={href}>{update.title}</Link></h3>
        <p className="updates-card-lede">{lede}</p>

        {update.featured_video_url && (
          <div className="updates-video-wrap" data-reveal="soft-pop">
            <UpdatesVideo
              src={update.featured_video_url}
              poster={update.featured_image_url || undefined}
              caption={update.title}
            />
          </div>
        )}

        {update.tags?.length > 0 && (
          <ul className="hashtag-chips" style={{ justifyContent: 'flex-start', margin: '0 0 16px' }}>
            {update.tags.map(tag => <li key={tag}>{tag}</li>)}
          </ul>
        )}

        <Link href={href} className="text-link">Read the full update <span>→</span></Link>
      </div>
    </article>
  )
}

export default async function UpdatesPage() {
  const { data: updates } = await getPublishedUpdates(50)

  return <SiteShell>
    <PageIntro
      eyebrow="FROM THE CAMPAIGN"
      title="What is happening"
      accent="in Nakuru."
      text="News, field notes, and moments from the trail of Richie Githatu's 2027 campaign — newest first."
    />

    <section className="section updates-magazine">
      <div className="container">
        <div className="section-heading" data-reveal="fade-up">
          <div><p className="eyebrow"><i /> LATEST</p><h2>Recent moments<br /><em>from the trail.</em></h2></div>
          <p>Updated as the campaign moves through Nakuru County.</p>
        </div>

        {updates.length > 0 ? (
          <div className="updates-magazine-list">
            {updates.map(update => <UpdateCard key={update.id} update={update} />)}
          </div>
        ) : (
          <p className="updates-magazine-foot">
            No updates have been published yet. Check back soon, or follow along on socials.
          </p>
        )}
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
