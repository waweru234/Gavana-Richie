import type { Metadata } from 'next'
import Link from 'next/link'
import { CommentForm } from '@/components/comment-form'
import { SocialIcons } from '@/components/social-icons'
import { ActionBand, PageIntro, SiteShell, StatStrip } from '@/components/site-shell'

const siteUrl = 'https://www.gavanarichie.com'

export const metadata: Metadata = {
  title: 'Support the Campaign | Richie Githatu for Governor 2027',
  description: 'Support Richie Githatu\'s 2027 gubernatorial campaign for Nakuru County. Every contribution powers a people-powered movement for accountable leadership and real opportunity.',
  keywords: ['donate to campaign', 'support Richie Githatu', 'Nakuru campaign donation', 'political donation Kenya'],
  authors: [{ name: 'Richie Githatu' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: `${siteUrl}/donate`,
    title: 'Support the Campaign | Richie Githatu for Governor 2027',
    description: 'Support Richie Githatu\'s 2027 gubernatorial campaign for Nakuru County.',
    siteName: 'Nakuru Kwetu',
    images: [{ url: `${siteUrl}/richie-portrait.jpeg`, width: 1200, height: 630, alt: 'Support the Campaign' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support the Campaign | Richie Githatu for Governor 2027',
    description: 'Support Richie Githatu\'s 2027 gubernatorial campaign for Nakuru County.',
    images: [`${siteUrl}/richie-portrait.jpeg`],
  },
  alternates: {
    canonical: `${siteUrl}/donate`,
  },
}

export default function DonatePage() {
  return <SiteShell>
    <PageIntro eyebrow="SUPPORT THE CAMPAIGN" title="Your KSh 10" accent="counts." text="Small support from many people creates a powerful path forward for Nakuru&apos;s future." />
    <StatStrip items={[{ value: '600100', label: 'Paybill' }, { value: '320032', label: 'Account number' }, { value: 'KSh 10', label: 'to begin' }, { value: '100%', label: 'purpose-led' }]} />

    {/* HERO — donate image + pay panel */}
    <section className="section donate-page">
      <div className="container donate-grid">
        <div className="donate-art" data-reveal="fade-right">
          <div className="donate-art-frame">
            <img src="/donate-ten.jpeg" alt="Richie Githatu · Support the movement · KSh 10" />
            <span className="donate-art-tag">SUPPORT THE MOVEMENT</span>
            <span className="donate-art-coin">10</span>
          </div>
          <figcaption className="donate-art-caption">Every shilling from many people fuels a people-powered campaign that listens, opens doors, and keeps the future in Nakuru&apos;s hands.</figcaption>
        </div>

        <div className="donate-detail" data-reveal="fade-left">
          <p className="eyebrow">M-PESA · INSTANT</p>
          <h2>Give simply.<br /><em>Keep moving forward.</em></h2>
          <p>Use the M-Pesa details below to support Richard Githatu&apos;s 2027 Governor campaign. Every contribution — large or small — fuels a people-powered movement for Nakuru.</p>

          <dl className="donate-pay-grid">
            <div><dt>Paybill</dt><dd>600100</dd></div>
            <div><dt>Account number</dt><dd>320032</dd></div>
            <div><dt>Smallest contribution</dt><dd>KSh 10</dd></div>
          </dl>

          <div className="donate-actions">
            <Link href="#send-note" className="button button-primary">Send us a note <span>↗</span></Link>
            <Link href="/students" className="text-link">Prefer to sponsor a student? See adopt-a-student <span>→</span></Link>
          </div>
        </div>
      </div>
    </section>

    {/* SEND US A MESSAGE / REACH US DIRECTLY — uses richie-cutout */}
    <section id="send-note" className="section donate-message-section">
      <div className="container donate-message-grid">
        <div className="donate-message-art" data-reveal="fade-left">
          <div className="donate-message-circle" />
          <div className="donate-message-frame">
            <img src="/richie-cutout.png" alt="Richie Githatu — the campaign you can reach on M-Pesa, email, and socials" />
            <span className="donate-message-tag">REACH US · EMAIL OR SOCIAL</span>
          </div>
          <div className="donate-message-frame-note">
            <p>&ldquo;Pay, then say hi. The next Sunday word lands first thing.&rdquo;</p>
            <cite>— Richie Githatu</cite>
          </div>
        </div>
        <div className="donate-message-copy" data-reveal="fade-right">
          <p className="eyebrow"><i /> AFTER YOU PAY</p>
          <h2>Leave a comment.<br /><em>Or just say hi.</em></h2>
          <p>You can pay directly by M-Pesa, but a short note from you helps the team credit your contribution, follow up with an accountability report, and connect you to a local coordinator in your constituency.</p>

          <CommentForm />

          <div className="donate-contact-bar">
            <p className="eyebrow"><i /> OR REACH US DIRECTLY</p>
            <ul className="donate-contact-list">
              <li>
                <span className="donate-contact-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35-.03.74-.25 1.02l-2.2 2.2z" /></svg>
                </span>
                <span><b>Call</b><a href="tel:+254716774555">0716 774 555</a></span>
              </li>
              <li>
                <span className="donate-contact-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.46-.5 6.54 6.45 6.54-6.45H5.46Zm15.04 1-7.07 6.97a1 1 0 0 1-1.39 0L4.5 6V18.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V6Z" /></svg>
                </span>
                <span><b>Email</b><a href="mailto:richardgithatu@gavanarichie.com">richardgithatu@gavanarichie.com</a></span>
              </li>
            </ul>
            <div className="donate-contact-socials">
              <p className="eyebrow"><i /> ON SOCIALS</p>
              <SocialIcons variant="navy" size="md" />
              <p className="donate-contact-socials-meta">Tag <b>@gavanarichie</b> with your photos and stories.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* STAND WITH RICHIE */}
    <section className="section donate-richie-image">
      <div className="container donate-richie-grid">
        <div className="donate-richie-copy" data-reveal="fade-left">
          <p className="eyebrow"><i /> THE MOVEMENT</p>
          <h2>Stand with Richie.<br /><em>Keep the campaign moving.</em></h2>
          <p>Every KSh 10 from many people is what keeps this campaign people-powered — not driven by single big donors, but by the daily support of Kenyans who believe Nakuru can do better.</p>
          <div className="donate-richie-socials">
            <SocialIcons variant="navy" size="md" />
            <p>Reach the campaign directly:<br /><a href="tel:+254716774555">0716 774 555</a> · <a href="mailto:richardgithatu@gavanarichie.com">richardgithatu@gavanarichie.com</a></p>
          </div>
        </div>
        <div className="donate-richie-art" data-reveal="fade-right">
          <div className="donate-richie-circle" />
          <img src="/richie-standing-cutout.png" alt="Richie Githatu standing and smiling · campaign rally" />
          <span className="donate-richie-tag">PEOPLE-POWERED.<br />BUILT TOGETHER.</span>
        </div>
      </div>
    </section>

    <ActionBand title="Every KSh 10 counts." text="Small support from many people creates a powerful path forward for Nakuru Kwetu." />
  </SiteShell>
}
