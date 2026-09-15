import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'

const events = [
  { date: 'SAT · 14 SEP', place: 'Bahati · Nakuru', title: 'Nakuru Kwetu community listening forum', text: 'A conversation with residents, youth leaders, and local businesses about the future we can build together.' },
  { date: 'SUN · 22 SEP', place: 'Nakuru Town East', title: 'New Generation youth roundtable', text: 'Young people share the ideas, barriers, and opportunities that must shape the 2027 agenda.' },
  { date: 'SAT · 05 OCT', place: 'Rongai · Nakuru', title: 'Adopt-a-Student community day', text: 'Come meet the students, learn their stories, and stand behind bright minds in our county.' },
]

const stories = [
  { tag: 'FIELD NOTE', date: '12 SEP 2026', title: 'Leadership starts by listening', text: 'From estates to market centres, the Nakuru Kwetu movement is making space for honest conversations about what people need next.' },
  { tag: 'CAMPAIGN NEWS', date: '08 SEP 2026', title: 'A practical agenda for a new generation', text: 'The 2027 governor campaign is focused on opportunity, accountable service, and leadership that opens doors.' },
  { tag: 'COMMUNITY', date: '31 AUG 2026', title: 'No bright mind left behind', text: 'The Adopt-a-Student programme is connecting supporters with students whose determination deserves a chance.' },
]

export default function UpdatesPage() {
  return <SiteShell>
    <PageIntro eyebrow="FROM THE CAMPAIGN" title="What is happening" accent="in Nakuru." text="Rallies, community conversations, campaign news, and words from Richie Githatu — all in one place." />
    <section className="newsroom-feature"><div className="container newsroom-feature-grid"><div><span className="newsroom-label">LATEST FROM RICHIE · 12 SEP 2026</span><h2>“Nakuru&apos;s future will be built by the people who live here.”</h2><p>Follow the campaign as Richie Githatu listens, shares the agenda, and meets the people shaping Nakuru County&apos;s next chapter.</p><Link href="/about" className="button button-primary">Meet Richie Githatu <span>↗</span></Link></div><div className="newsroom-feature-mark"><strong>032</strong><span>NAKURU<br />KWETU</span></div></div></section>
    <section className="section events-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">ON THE GROUND</p><h2>Events &amp; <em>rallies.</em></h2></div><p>Join the conversation, bring a neighbour, and help make Nakuru&apos;s next chapter a shared one.</p></div><div className="event-grid">{events.map(event => <article className="event-card" key={event.title}><div className="event-date"><strong>{event.date.split(' · ')[0]}</strong><span>{event.date.split(' · ')[1]}</span></div><div><span className="event-place">{event.place}</span><h3>{event.title}</h3><p>{event.text}</p><Link href="/join" className="text-link">Join this conversation <span>→</span></Link></div></article>)}</div></div></section>
    <section className="section updates"><div className="container"><div className="section-heading"><div><p className="eyebrow">NEWSROOM</p><h2>News, notes &amp; <em>field updates.</em></h2></div><p>Stories and announcements from the people-powered movement for Nakuru.</p></div><div className="update-grid">{stories.map(story => <article className="update-card" key={story.title}><span>{story.tag}</span><small>{story.date}</small><h2>{story.title}</h2><p>{story.text}</p><Link href="/join" className="text-link">Stay connected <span>→</span></Link></article>)}</div></div></section>
    <section className="quote-section"><div className="container quote-section-inner"><p className="eyebrow">WORDS FROM RICHIE</p><blockquote>“The work is not about one person. It is about opening doors for every generation of Nakuru.”</blockquote><cite>— Richie Githatu</cite></div></section>
    <ActionBand title="Stay close to the work." text="Join the movement for campaign updates, community events, and the conversations shaping Nakuru Kwetu." />
  </SiteShell>
}
