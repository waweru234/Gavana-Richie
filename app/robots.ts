import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.gavanarichie.com'

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/', '/_next/'],
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}