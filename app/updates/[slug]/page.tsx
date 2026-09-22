import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteShell } from '@/components/site-shell'
import { UpdatesVideo } from '@/components/updates-video'
import { getUpdateBySlug, UpdatePost } from '@/lib/updates'

interface UpdatePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: UpdatePageProps): Promise<Metadata> {
  const { slug } = await params
  const update = await getUpdateBySlug(slug)
  
  if (!update) {
    return { title: 'Update Not Found' }
  }

  const siteUrl = 'https://gavanarichie.com'
  const updateUrl = `${siteUrl}/updates/${update.slug}`

  return {
    title: update.seo_title || update.title,
    description: update.seo_description || update.excerpt,
    keywords: update.seo_keywords || update.tags.join(', '),
    alternates: { canonical: updateUrl },
    openGraph: {
      type: 'article',
      url: updateUrl,
      title: update.seo_title || update.title,
      description: update.seo_description || update.excerpt,
      publishedTime: update.published_at,
      modifiedTime: update.updated_at,
      authors: ['Richie Githatu'],
      tags: update.tags,
      images: update.featured_image_url ? [{ url: update.featured_image_url, width: 1200, height: 630, alt: update.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: update.seo_title || update.title,
      description: update.seo_description || update.excerpt,
      images: update.featured_image_url ? [update.featured_image_url] : [],
    },
    other: {
      'article:published_time': update.published_at || '',
      'article:modified_time': update.updated_at,
      'article:author': 'Richie Githatu',
      'article:section': update.category,
      'article:tag': update.tags.join(', '),
    },
  }
}

export async function generateStaticParams() {
  try {
    const supabase = (await import('@/lib/supabase')).createServerClient()
    const { data: updates } = await supabase
      .from('updates')
      .select('slug')
      .eq('published', true)
    return (updates || []).map((u) => ({ slug: u.slug }))
  } catch {
    return []
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    CIVIC: '#4a2c6a',
    HEALTH: '#1b5e20',
    FIELD: '#173a70',
    EVENT: '#d97706',
    EDUCATION: '#0277bd',
    ECONOMY: '#5d4037',
    GOVERNANCE: '#37474f',
    ENVIRONMENT: '#2e7d32',
    YOUTH: '#c62828',
    ENGAGEMENT: '#6a1b9a',
    OTHER: '#455a64',
  }
  return colors[category.toUpperCase()] || '#455a64'
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { slug } = await params
  const update = await getUpdateBySlug(slug)

  if (!update) {
    notFound()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: update.title,
    description: update.excerpt,
    image: update.featured_image_url ? `https://gavanarichie.com${update.featured_image_url}` : undefined,
    datePublished: update.published_at,
    dateModified: update.updated_at,
    author: {
      '@type': 'Person',
      name: 'Richie Githatu',
      url: 'https://gavanarichie.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nakuru Kwetu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gavanarichie.com/richie-cutout.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gavanarichie.com/updates/${update.slug}`,
    },
    keywords: update.seo_keywords || update.tags.join(', '),
  }

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="update-detail">
        <header className="update-header" data-reveal="fade-up">
          <div className="update-meta">
            <span
              className="update-category"
              style={{ backgroundColor: getCategoryColor(update.category) }}
            >
              {update.category}
            </span>
            <time dateTime={update.published_at || update.created_at}>
              {formatDate(update.published_at || update.created_at)}
            </time>
          </div>
          <h1>{update.title}</h1>
          <p className="update-excerpt">{update.excerpt}</p>
          <div className="update-tags">
            {update.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
        </header>

        {update.featured_video_url && (
          <div className="update-video" data-reveal="soft-pop">
            <UpdatesVideo
              src={update.featured_video_url}
              poster={update.featured_image_url || undefined}
              caption={`Video: ${update.title}`}
            />
          </div>
        )}

        {update.featured_image_url && !update.featured_video_url && (
          <div className="update-image" data-reveal="soft-pop">
            <img
              src={update.featured_image_url}
              alt={update.title}
              loading="lazy"
            />
          </div>
        )}

        <div className="update-content" data-reveal="fade-up">
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: update.content }}
          />
        </div>

        <footer className="update-footer" data-reveal="fade-up">
          <Link href="/updates" className="back-link">
            ← Back to all updates
          </Link>
          <Link href="/manifesto" className="text-link">
            Read the manifesto →
          </Link>
        </footer>
      </article>
    </SiteShell>
  )
}