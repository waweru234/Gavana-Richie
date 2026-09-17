import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { HelpAssistant } from '@/components/help-assistant'
import { ScrollReveal } from '@/components/scroll-reveal'
import { WhatsAppFab } from '@/components/whatsapp-fab'

export const metadata: Metadata = {
  title: 'Richie Githatu for Governor 2027 | Nakuru Kwetu',
  description: 'The official campaign platform for Richie Githatu, candidate for Governor of Nakuru County in 2027. Explore the agenda, register to vote, and join Nakuru Kwetu.',
  metadataBase: new URL('https://gavanarichie.com'),
  alternates: { canonical: '/' },
  openGraph: { title: 'Richie Githatu for Governor 2027 | Nakuru Kwetu', description: 'A new-generation campaign for Governor of Nakuru County.', url: 'https://gavanarichie.com', siteName: 'Richie Githatu for Governor', images: [{ url: '/richie-portrait.jpeg', width: 853, height: 1280, alt: 'Richie Githatu' }] },
  generator: 'v0.app',
  icons: { icon: '/richie-cutout.png', apple: '/richie-cutout.png' },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#173A70',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <HelpAssistant />
        <WhatsAppFab />
        <ScrollReveal />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
