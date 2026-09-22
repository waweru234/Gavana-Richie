import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase'
import { studentProfiles } from '@/lib/student-profiles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gavanarichie.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/manifesto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/updates`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/students`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Student pages from local data
  const studentPages: MetadataRoute.Sitemap = studentProfiles.map((student) => ({
    url: `${baseUrl}/students/${student.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Dynamic pages from Supabase - fetch published updates
  let dynamicPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createServerClient()
    const { data: updates, error } = await supabase
      .from('updates')
      .select('slug, published_at, updated_at')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (!error && updates) {
      dynamicPages = updates.map((update) => ({
        url: `${baseUrl}/updates/${update.slug}`,
        lastModified: update.published_at ? new Date(update.published_at) : new Date(update.updated_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    }
  } catch (error) {
    console.warn('Failed to fetch updates for sitemap:', error)
  }

  return [...staticPages, ...studentPages, ...dynamicPages]
}