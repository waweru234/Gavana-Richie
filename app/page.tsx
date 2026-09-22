import Link from 'next/link'
import { ActionBand, SiteShell, StatStrip } from '@/components/site-shell'
import { JawabuKenyaHero } from '@/components/jawabu-kenya-hero'
import { studentProfiles } from '@/lib/student-profiles'

const siteUrl = 'https://nakurukwetu.co.ke'

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

export default function Home() {
  const featuredStudents = studentProfiles.slice(0, 2)
  const moreStudents = studentProfiles.slice(2)

  return <SiteShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <section className="hero hero-richie"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow"><i /> 2027 GOVERNOR · NAKURU COUNTY</p><h1>RICHIE GITHATU<br /><em>Nakuru Kwetu.</em></h1><p className="hero-kicker">New Generation leadership for Nakuru County</p><p className="hero-text">Richie Githatu is running for Governor of Nakuru County in 2027 — with a practical agenda for opportunity, accountable leadership, and a county that works for everyone.</p><div className="hero-actions"><Link href="/about" className="button button-primary">Meet Richie Githatu <span>↗</span></Link><Link href="/students" className="button button-secondary">Adopt a Student <span>↗</span></Link><Link href="/manifesto" className="text-link">Read the agenda <span>→</span></Link></div><div className="hero-election-badge"><strong>2027</strong><span>YOUR VOICE<br />YOUR CHOICE</span></div><div className="promise"><b>032</b><span><strong>Linda Nakuru.</strong><br />Nakuru Kwetu · New Generation</span></div></div><div className="hero-visual hero-cutout"><div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><img src="/richie-cutout.png" alt="Richie Githatu in a white shirt" /><div className="floating-note"><b>NAKURU</b><span>KWETU.</span></div><div className="hero-signature">Richie Githatu</div></div></div></section>

    <section className="programme-banner programme-feature" data-reveal="fade-up"><div className="container programme-banner-inner"><div className="programme-mark">01</div><div><p className="eyebrow">ADOPT-A-STUDENT PROGRAMME</p><h2>No bright mind<br /><em>left behind.</em></h2><p>Stand with {studentProfiles.length} determined Nakuru students. Pick a profile, pay directly to their school, and help keep a child learning.</p></div><Link href="/students" className="button button-primary">ADOPT-A-STUDENT. GIVE TODAY. <span>↗</span></Link></div></section>

    <JawabuKenyaHero />
    <span className="jawaban-stripe" aria-hidden />

    <section className="section students students-home" data-reveal="fade-up">
      <div className="container">
        <div className="section-heading">
          <div><p className="eyebrow"><i /> ADOPT-A-STUDENT PROGRAMME</p><h2>Students<br /><em>ready to learn.</em></h2></div>
          <p>Pick a student. Pay directly to their school. Any amount will be appreciated.</p>
        </div>
        <div className="student-grid" data-reveal="stagger">{featuredStudents.map(student => <Link href={`/students/${student.slug}`} className={'student-card student-card-link' + (student.sponsored ? ' student-card-sponsored' : '')} key={student.slug}><div className="student-image"><img src={student.image} alt={student.name} />{student.sponsored && <span className="student-sponsored-badge"><span className="student-sponsored-tick" aria-hidden>✓</span> SPONSORED</span>}<span>{student.number} · {student.tag.toUpperCase()}</span></div><div className="student-body"><span className="label">{student.name.toUpperCase()}</span><h3>{student.school}</h3><p>{student.short}</p><div className="student-details"><span>PAY BILL <b>{student.paybill}</b></span><span>ACCOUNT <b>{student.account}</b></span></div>{student.sponsored ? <div className="need need-sponsored"><b>✓ FULLY SPONSORED</b><span>{student.sponsoredBy ? `Covered by ${student.sponsoredBy} · ${student.sponsoredDate ?? ''}` : 'Already covered · pick the next student'}</span></div> : <div className="need"><b>{student.need}</b><span>Goal · any amount will help</span></div>}<span className="card-link">View full profile <span>→</span></span></div></Link>)}</div>

        <div className="students-more-prompt" data-reveal="soft-pop">
          <div>
            <p className="eyebrow"><i /> {moreStudents.length === 1 ? '1 MORE WAITING' : `${moreStudents.length} MORE WAITING`}</p>
            <strong>{moreStudents.length === 1 ? 'There is 1 more student' : `There are ${moreStudents.length} more students`} in this programme.</strong>
            <span>Francis is studying automotive engineering at Rift Valley Institute of Business Studies — his full story and his account details are waiting on the next page.</span>
          </div>
          <Link href="/students" className="button button-primary">See all {studentProfiles.length} profiles <span>↗</span></Link>
        </div>

        <div className="adopt-cta-strip" data-reveal="soft-pop"><div><p className="eyebrow"><i /> ADOPT-A-STUDENT</p><strong>ADOPT-A-STUDENT. GIVE TODAY.</strong><span>Pay directly to the school of the child you choose. Any amount will be appreciated.</span></div><Link href="/students" className="button button-primary">Choose a student <span>→</span></Link></div>

        <div className="student-hashtags" data-reveal="fade-up">
          <p className="eyebrow"><i /> CAMPAIGN</p>
          <strong>ADOPT-A-STUDENT. <em>Give today.</em></strong>
          <ul className="hashtag-chips">
            <li>#KeepAChildInSchool</li>
            <li>#EveryChildDeservesAChance</li>
            <li>#EducationForAll</li>
            <li>#YourSupportTheirFuture</li>
            <li>#InvestInEducation</li>
          </ul>
        </div>
      </div>
    </section>

    <div data-reveal="scale-in"><StatStrip items={[{ value: studentProfiles.length.toString(), label: 'students you can adopt' }, { value: '11/11', label: 'sub-counties served' }, { value: '1,000,000', label: 'jobs target in term one' }, { value: 'Your voice', label: 'your power' }]} /></div>

    <section className="section voter-section" data-reveal="tilt-in"><div className="container voter-quote"><p className="eyebrow">A MESSAGE FOR NAKURU</p><blockquote>“If you are eligible to vote, register. Your voice is your power, and your participation will help shape Nakuru County&apos;s future in 2027.”</blockquote><cite>— Richie Githatu</cite></div></section>

    <section className="section about-feature" data-reveal="fade-left"><div className="container about-feature-grid"><div className="about-cutout" data-reveal="fade-right"><div className="about-circle" /><img src="/richie-seated-cutout.png" alt="Richie Githatu seated and smiling" /><span>TOGETHER<br /><b>WE RISE.</b></span></div><div className="about-feature-copy"><p className="eyebrow">ABOUT RICHIE GITHATU</p><h2>Together we rise.<br /><em>Leadership opens doors.</em></h2><p>Leadership begins with showing up: listening closely, opening doors, and believing in the people who make Nakuru home.</p><p>Richie Githatu brings a new-generation spirit to public service — practical, warm, and focused on turning ideas into opportunity.</p><Link href="/about" className="button button-primary">Read about Richie <span>↗</span></Link></div></div></section>

    <section className="section feature-section feature-section-redesign"><div className="container"><div className="section-heading" data-reveal="fade-up"><div><p className="eyebrow">THE AGENDA</p><h2>Ideas that move<br /><em>people forward.</em></h2></div><p>Two ideas leading the manifesto, anchored by eight pillars of transformation — built to put county spending and county markets to work for Nakuru&apos;s young people.</p></div><div className="feature-grid feature-grid-four" data-reveal="stagger"><Link href="/manifesto" className="feature-card feature-card-dark"><span>01 · YOUTH</span><h3>Vijana na Tender</h3><p>Every county tender above KSh 5M takes on 5 youth interns for 6 months — paid by the county.</p><i className="feature-stat">2,840</i><small>internships a term from 568 contracts</small><b>Explore the policy →</b></Link><Link href="/students" className="feature-card feature-card-blue"><span>02 · EDUCATION</span><h3>Adopt-a-Student</h3><p>Pay directly to a student&apos;s school. Keep a child in class and learning toward their dream.</p><i className="feature-stat">{studentProfiles.length}</i><small>students you can support today</small><b>Meet the students →</b></Link><Link href="/manifesto" className="feature-card feature-card-red"><span>03 · MARKETS</span><h3>Soko Bila Rent</h3><p>Regular ward market days across all 11 sub-counties — direct access to customers, no shop rent.</p><i className="feature-stat">0</i><small>shop rent to reach first customers</small><b>Read the policy →</b></Link><Link href="/manifesto" className="feature-card feature-card-navy"><span>04 · GOVERNANCE</span><h3>Procurement Scorecard</h3><p>Publish every award. Public interns tracking. Performance contracts. Accountability by design.</p><i className="feature-stat">0</i><small>tolerance for corruption and wastage</small><b>Read pillar 8 →</b></Link></div></div></section>

    <section className="section support-section" data-reveal="fade-right"><div className="container support-grid"><div><p className="eyebrow">SUPPORT THE MOVEMENT</p><h2>Stand with Richie.<br /><em>Keep the movement moving.</em></h2><p>Small support from many people creates a powerful path forward for Nakuru. Help us keep the campaign open, people-powered, and moving — alongside the {studentProfiles.length} students in your Adopt-a-Student programme.</p><Link href="/donate" className="button button-primary">Support the movement <span>↗</span></Link></div><div className="support-visual"><img src="/richie-standing-cutout.png" alt="Richie Githatu standing and smiling" /><div><strong>People-powered.</strong><br />Built together.</div></div></div></section>

    <section className="section page-story page-story-quiet" data-reveal="fade-up"><div className="container page-story-grid"><div className="page-story-art" data-reveal="fade-right"><span className="page-story-circle" /><img src="/richie-main.png" alt="Richie Githatu &mdash; candidate for Governor of Nakuru County 2027" /></div><div className="page-story-copy" data-reveal="fade-left"><p className="eyebrow"><i /> FROM THE TRAIL</p><h2>Walking the county,<br /><em>one ward at a time.</em></h2><p>Door-by-door and ward-by-ward &mdash; the campaign is built from the ground up. Every conversation shapes the agenda, every supporter shapes the movement, and every shilling from many people fuels the work of opening doors for Nakuru.</p><Link href="/updates" className="button button-primary">See the latest updates <span>&rarr;</span></Link></div></div></section>

    <section className="section homepage-newsroom" data-reveal="fade-up">
      <div className="container">
        <div className="section-heading">
          <div><p className="eyebrow"><i /> LATEST</p><h2>Newsroom.<br /><em>Three things, one at a time.</em></h2></div>
          <p>The latest three things from the campaign — one after another, in order.</p>
        </div>
        <ol className="newsroom-list" data-reveal="stagger">
          <li className="newsroom-item">
            <span className="newsroom-number">01</span>
            <div className="newsroom-body">
              <span className="newsroom-tag">CAMPAIGN · 14 SEP 2026</span>
              <h3>A Sunday word from Richie</h3>
              <p>&ldquo;ADOPT-A-STUDENT. Give today. Every shilling from many people is the path that puts a child back in class.&rdquo;</p>
            </div>
            <Link href="/updates" className="text-link">Read it <span>→</span></Link>
          </li>
          <li className="newsroom-item">
            <span className="newsroom-number">02</span>
            <div className="newsroom-body">
              <span className="newsroom-tag">EVENT · 18 AUG 2026</span>
              <h3>Richie Githatu turned 30</h3>
              <p>A community homecoming that sharpened what we&apos;re walking into: a county-shaped person stepping forward to lead the county.</p>
            </div>
            <Link href="/updates" className="text-link">Read it <span>→</span></Link>
          </li>
          <li className="newsroom-item">
            <span className="newsroom-number">03</span>
            <div className="newsroom-body">
              <span className="newsroom-tag">STUDENT · AUG 2026</span>
              <h3>Shawn&apos;s fees were covered</h3>
              <p>The first Adopt-a-Student success story. Shawn Ndungu Mbugua is back in class — fully sponsored — and on track to finish his technical education.</p>
            </div>
            <Link href="/students/shawn-ndungu" className="text-link">Read it <span>→</span></Link>
          </li>
        </ol>
        <p className="newsroom-foot">Want the full feed? <Link href="/updates" className="text-link">See all updates from the campaign <span>→</span></Link></p>
      </div>
    </section>

    <section className="join-cta" data-reveal="rise"><div className="container join-cta-inner"><div><p className="eyebrow">2027 GOVERNOR CAMPAIGN</p><h2>Bring your voice.<br /><em>Choose your future.</em></h2></div><Link href="/join" className="button">Join the movement <span>↗</span></Link></div></section>
  </SiteShell>
}
