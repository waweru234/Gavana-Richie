import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { HelpAssistant } from '@/components/help-assistant'
import { ScrollReveal } from '@/components/scroll-reveal'

const siteUrl = 'https://gavanarichie.com'
const siteName = 'Richie Githatu for Governor 2027 | Nakuru Kwetu'

export const metadata: Metadata = {
  title: {
    default: 'Richie Githatu for Governor 2027 | Nakuru Kwetu',
    template: '%s | Richie Githatu for Governor',
  },
  description: 'The official campaign platform for Richie Githatu, candidate for Governor of Nakuru County in 2027. Explore the agenda, register to vote, and join Nakuru Kwetu.',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: siteUrl,
    siteName,
    title: 'Richie Githatu for Governor 2027 | Nakuru Kwetu',
    description: 'A new-generation campaign for Governor of Nakuru County — opportunity, accountability, and a county that works for everyone.',
    images: [
      { url: '/richie-portrait.jpeg', width: 1200, height: 630, alt: 'Richie Githatu — Nakuru Kwetu Campaign' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@NakuruKwetu',
    creator: '@RichieGithatu',
    title: 'Richie Githatu for Governor 2027 | Nakuru Kwetu',
    description: 'A new-generation campaign for Governor of Nakuru County.',
    images: ['/richie-portrait.jpeg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: 'google-site-verification-code' },
  generator: 'Next.js',
  icons: { icon: '/favicon.ico', apple: '/richie-cutout.png', shortcut: '/favicon.ico' },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#173A70',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Cinzel:wght@400..900&family=Montserrat:wght@300..900&display=swap" />
      </head>
      <body className="antialiased">
        {children}
        <HelpAssistant />
        <ScrollReveal />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
