import Link from 'next/link'
import { JoinForm } from '@/components/join-form'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'

const ways = [
  { number: '01', title: 'Volunteer your time', text: 'Help us listen at rallies, knocking doors, organising the cars at events — and reaching more people across Nakuru.' },
  { number: '02', title: 'Share the vision', text: 'Talk to your family, friends, and neighbours about the ideas that matter. Word of mouth is how this trail moves.' },
  { number: '03', title: 'Adopt a student', text: 'Pay directly to a school, or signal which constituency you&apos;ll help coordinate in. Pick the next student waiting.' },
]

export default function JoinPage() {
  return <SiteShell>
    <PageIntro
      eyebrow="JOIN THE MOVEMENT"
      title="Bring your voice."
      accent="Build the future."
      text="Nakuru belongs to all of us. A people-powered movement that&apos;s only as strong as the names on the door-by-door list — yours included."
    />

    <section className="section join-section">
      <div className="container join-grid">
        <div className="join-form-side" data-reveal="fade-right">
          <p className="eyebrow"><i /> ADD YOUR NAME</p>
          <h2>There is a place<br /><em>for your energy.</em></h2>
          <p>Tell us your name, a phone number to reach you, and whether you call Nakuru home. If you do — pick your constituency. The team on the ground will be in touch with what&apos;s next.</p>
          <ul className="join-form-meta">
            <li><span className="join-form-meta-dot" aria-hidden>●</span><b>Direct</b><span>Your details reach the local coordinator — not a national CRM.</span></li>
            <li><span className="join-form-meta-dot" aria-hidden>●</span><b>Private</b><span>We never share your phone or email outside the campaign team.</span></li>
            <li><span className="join-form-meta-dot" aria-hidden>●</span><b>Honest</b><span>This is volunteer movement-building, not a fundraising pipeline.</span></li>
          </ul>
          <div className="join-side-cta">
            <p>Or skip the form:</p>
            <a className="text-link" href="mailto:richardgithatu@gavanarichie.com">Email richardgithatu@gavanarichie.com <span>→</span></a>
          </div>
        </div>
        <div className="join-form-slot" data-reveal="fade-left">
          <JoinForm />
        </div>
      </div>
    </section>

    <section className="section join-ways" data-reveal="fade-up">
      <div className="container">
        <div className="section-heading">
          <div><p className="eyebrow"><i /> THREE WAYS TO JOIN</p><h2>Many ways<br /><em>to take part.</em></h2></div>
          <p>Once you&apos;re in, the local team will help you choose how your time and energy move the needle most.</p>
        </div>
        <ul className="join-ways-grid">
          {ways.map(w => <li key={w.number}><span>{w.number}</span><div><h3>{w.title}</h3><p>{w.text}</p></div></li>)}
        </ul>
        <p className="join-ways-foot">Already a supporter? <Link href="/donate" className="text-link">Support the movement with KSh 10 <span>→</span></Link></p>
      </div>
    </section>

    <ActionBand title="Together we can do more." text="The next chapter of Nakuru is written by people who choose to participate." />
  </SiteShell>
}
