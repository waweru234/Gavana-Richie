import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell, StatStrip } from '@/components/site-shell'
import { JawabuKenyaBanner } from '@/components/jawabu-kenya-banner'
import { JawabuKenyaHero } from '@/components/jawabu-kenya-hero'
import { studentProfiles } from '@/lib/student-profiles'

const coreValues = [
  { title: 'Dignity & Inclusion', text: 'Every child deserves respect, fairness and equal opportunity.' },
  { title: 'Integrity & Accountability', text: 'Every contribution must be managed transparently and responsibly.' },
  { title: 'Compassion & Commitment', text: 'We respond to hardship with care and remain committed to keeping children in school.' },
  { title: 'Partnership & Collective Action', text: 'Keeping a child in school becomes everyone&apos;s responsibility.' },
]

const objectives = [
  'Mobilise resources to support school fees for vulnerable children.',
  'Prevent school interruption and dropout caused by financial hardship.',
  'Build a network of individual and institutional education sponsors.',
  'Encourage community ownership of education support.',
  'Establish transparent beneficiary identification and disbursement mechanisms.',
  'Promote education support as an investment in the community&apos;s future.',
]

const beneficiaries = [
  'Children from extremely vulnerable households and orphans/vulnerable children.',
  'Children affected by unemployment, loss of livelihood, disasters or emergencies.',
  'Children at risk of dropping out because of accumulated school fees.',
  'Children whose parents/guardians cannot meet essential education costs.',
]

const hashtags = ['#KeepAChildInSchool', '#EveryChildDeservesAChance', '#EducationForAll', '#YourSupportTheirFuture', '#InvestInEducation']

export default function StudentsPage() {
  return (
    <SiteShell>
      <JawabuKenyaHero />
      <span className="jawaban-stripe" aria-hidden />

      <section className="section jawaban-partner-note" data-reveal="fade-up">
        <div className="container jawaban-partner-note-inner">
          <div className="jawaban-partner-note-art">
            <img src="/wanavijiji-2.jpg" alt="Wanavijiji Housing Cooperative Society community solidarity engagement" loading="lazy" />
            <span className="jawaban-partner-note-tag">JAWABU KENYA · SIBLING PROGRAMME</span>
          </div>
          <div className="jawaban-partner-note-copy">
            <p className="eyebrow"><i /> ANOTHER PROGRAMME UNDER JAWABU KENYA</p>
            <h2>Building homes with <em>Nakuru Wanavijiji Housing Cooperative Society.</em></h2>
            <p>The Jawabu Kenya partnership has now grown into a second programme — a solidarity engagement with Wanavijiji, where 30 members received blankets and the campaign walked through the housing construction site. We are asking for the next layer: building materials, mattresses, and more blankets to keep the build moving.</p>
            <div className="jawaban-partner-note-actions">
              <Link href="#wanavijiji" className="button button-primary">See what we need <span>↓</span></Link>
              <Link href="/updates" className="text-link">Read the latest update <span>→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <PageIntro
        eyebrow="ADOPT-A-STUDENT"
        title="Every child"
        accent="deserves education."
        text="A people-powered campaign to keep vulnerable children in school — through school fees, examinations and the essentials that make learning possible."
      />

{/* STUDENTS FIRST */}
      <section id="meet-students" className="section students">
        <div className="container">
          <div className="section-heading" data-reveal="fade-up">
            <div>
              <p className="eyebrow"><i /> MEET THE STUDENTS</p>
              <h2>Pick a student.<br /><em>Pay the school directly.</em></h2>
            </div>
            <p>Choose a student below to view their full profile. Use the M-Pesa details on their card or profile — payments go directly to their school.</p>
          </div>
          <div className="student-grid" data-reveal="stagger">
            {studentProfiles.map(student => (
              <Link href={`/students/${student.slug}`} className={'student-card student-card-link' + (student.sponsored ? ' student-card-sponsored' : '')} key={student.slug}>
                <div className="student-image">
                  <img src={student.image} alt={`${student.name} student profile`} />
                  {student.sponsored && <span className="student-sponsored-badge"><span className="student-sponsored-tick" aria-hidden>✓</span> SPONSORED</span>}
                  <span>{student.number} · {student.tag.toUpperCase()}</span>
                </div>
                <div className="student-body">
                  <span className="label">{student.name.toUpperCase()}</span>
                  <h3>{student.school}</h3>
                  <p>{student.short}</p>
                  <div className="student-details"><span>PAY BILL <b>{student.paybill}</b></span><span>ACCOUNT <b>{student.account}</b></span></div>
                  {student.sponsored ? (
                    <div className="need need-sponsored"><b>✓ FULLY SPONSORED</b><span>{student.sponsoredBy ? `Covered by ${student.sponsoredBy} · ${student.sponsoredDate ?? ''}` : 'Already covered · pick the next student'}</span></div>
                  ) : (
                    <div className="need"><b>{student.need}</b><span>Goal · any amount will help</span></div>
                  )}
                  <span className="card-link">View {student.sponsored ? 'success story' : 'full profile'} <span>→</span></span>
                </div>
              </Link>
            ))}
          </div>

          <JawabuKenyaBanner />
        </div>
      </section>

      {/* Wanavijiji — a Jawabu Kenya partner programme */}
      <section id="wanavijiji" className="section programme-section wanavijiji-section">
        <div className="container">
          <div className="section-heading" data-reveal="fade-up">
            <div>
              <p className="eyebrow"><i /> ANOTHER JAWABU KENYA PROGRAMME</p>
              <h2>Building homes with<br /><em>Wanavijiji.</em></h2>
            </div>
            <p>ADOPT-A-STUDENT keeps children in school. Wanavijiji keeps families in homes. Jawabu Kenya runs both — and right now the housing cooperative is asking for the next layer of solidarity.</p>
          </div>

          <div className="wanavijiji-gallery" data-reveal="stagger">
            <figure className="wanavijiji-photo">
              <img src="/wanavijiji-1.jpg" alt="Wanavijiji members receiving donated blankets during the solidarity engagement" loading="lazy" />
              <figcaption>30 members received blankets.</figcaption>
            </figure>
            <figure className="wanavijiji-photo">
              <img src="/wanavijiji-2.jpg" alt="Wanavijiji members group engagement with the campaign" loading="lazy" />
              <figcaption>A member group in conversation.</figcaption>
            </figure>
            <figure className="wanavijiji-photo">
              <img src="/wanavijiji-3.jpg" alt="Wanavijiji housing construction site tour" loading="lazy" />
              <figcaption>The housing construction site.</figcaption>
            </figure>
          </div>

          <div className="wanavijiji-quote" data-reveal="fade-up">
            <span className="wanavijiji-quote-mark" aria-hidden>&ldquo;</span>
            <p>When ordinary people come together with a shared vision, they can create extraordinary change. From saving together to building homes together, Wanavijiji continues to demonstrate that community power can transform lives and restore dignity.</p>
            <span className="wanavijiji-quote-mark" aria-hidden>&rdquo;</span>
            <cite>Wanavijiji Housing Cooperative Society · Nakuru</cite>
          </div>

          <div className="wanavijiji-need" data-reveal="fade-up">
            <p className="eyebrow"><i /> WHAT WE ARE ASKING FOR · FROM THE JAWABU KENYA PARTNER LIST</p>
            <h3>Building materials, mattresses, &amp; <em>more blankets.</em></h3>
            <ul className="wanavijiji-need-list">
              <li><b>Building materials</b> &mdash; cement, ballast, sand, timber, iron sheets, roofing nails.</li>
              <li><b>Mattresses</b> &mdash; single and family sizes for newly-built units.</li>
              <li><b>Blankets</b> &mdash; 30 already delivered; more families queue every month.</li>
              <li><b>Savings match</b> &mdash; top up a member&apos;s monthly saving to unlock the next home.</li>
              <li><b>Skilled fundis</b> &mdash; volunteer masons, electricians, plumbers willing to spend a Saturday.</li>
            </ul>
            <p className="wanavijiji-foot">Direct the support to the Jawabu Kenya office in Milimani Estate, Elgeyo Road &mdash; or send a note via the Join form so the cooperative can schedule the next drop-off.</p>
          </div>
        </div>
      </section>


      {/* Campaign Background */}
      <section id="why-adopt" className="section programme-section">
        <div className="container programme-narrow">
          <p className="eyebrow"><i /> CAMPAIGN BACKGROUND</p>
          <h2>Why<br /><em>ADOPT-A-STUDENT.</em></h2>
          <p>Education is one of the most important investments a society can make in its children. Yet poverty and household vulnerability continue to make it difficult for many children in Kenya to remain in school.</p>
          <p>Free and compulsory basic education does not remove every financial barrier. Families may still struggle with uniforms, learning materials, transport, meals, examination-related requirements and other education costs.</p>
          <p>The ADOPT-A-STUDENT Campaign will mobilize individuals, families, businesses, institutions, faith communities, professionals, alumni, community organizations and well-wishers to support children at immediate risk of missing school, being sent home, failing examinations, interrupting their education or dropping out because of financial hardship.</p>
        </div>
      </section>

      {/* What the Campaign Supports */}
      <section className="section programme-section">
        <div className="container programme-narrow">
          <p className="eyebrow"><i /> WHAT THE CAMPAIGN SUPPORTS</p>
          <h2>Direct support<br /><em>for real education costs.</em></h2>
          <ul className="programme-list">
            <li><b>School fees</b> and outstanding balances</li>
            <li><b>Examination-related costs</b></li>
          </ul>
        </div>
      </section>

      {/* Vision · Mission · Goal */}
      <section className="section programme-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> VISION · MISSION · GOAL</p>
              <h2>What we are<br /><em>working toward.</em></h2>
            </div>
          </div>
          <div className="vm-triple">
            <article className="vm-triple-card">
              <span>VISION</span>
              <p>A society where every child stays in school, reaches their full potential and has the opportunity to build a better future.</p>
            </article>
            <article className="vm-triple-card">
              <span>MISSION</span>
              <p>To mobilize people, communities and institutions to provide timely and dignified support that keeps vulnerable children in school, enables completion and unlocks potential.</p>
            </article>
            <article className="vm-triple-card">
              <span>GOAL</span>
              <p>To keep children from vulnerable households in school through timely financial and educational support that prevents interruption and dropout.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section programme-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> CORE VALUES</p>
              <h2>What this campaign<br /><em>stands on.</em></h2>
            </div>
          </div>
          <div className="values-grid">
            {coreValues.map(v => (
              <article className="value-card" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section programme-section">
        <div className="container programme-narrow">
          <p className="eyebrow"><i /> CAMPAIGN OBJECTIVES</p>
          <h2>Six commitments<br /><em>in service of children.</em></h2>
          <ol className="programme-numbered">
            {objectives.map((o, i) => <li key={i}><b>0{i + 1}</b><span>{o}</span></li>)}
          </ol>
        </div>
      </section>

      {/* Target Beneficiaries */}
      <section className="section programme-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> TARGET BENEFICIARIES</p>
              <h2>Who ADOPT-A-STUDENT<br /><em>serves.</em></h2>
            </div>
            <p>Assistance is based on demonstrated need — not political, religious, ethnic, personal or social connections.</p>
          </div>
          <ul className="programme-list programme-list-box">
            {beneficiaries.map((b, i) => <li key={i}><b>{`0${i + 1}`}</b><span>{b}</span></li>)}
          </ul>
        </div>
      </section>

      {/* Donor Appeal */}
      <section className="section programme-section">
        <div className="container programme-narrow">
          <p className="eyebrow"><i /> DONOR APPEAL</p>
          <h2>Every child deserves<br /><em>the chance to dream.</em></h2>
          <p>Every child deserves the opportunity to go to school, discover their talents and dream about a better future. For some families, rising costs, unemployment, loss of income, illness, disasters and other hardships make school fees an overwhelming burden. The result can be missed classes, interrupted learning or dropout.</p>
          <p>The ADOPT-A-STUDENT Campaign brings together individuals, families, businesses, institutions, faith communities and well-wishers to mobilize resources for children at risk of missing school because of financial hardship.</p>
          <p>Any amount you can give will help sponsor part or all of a verified school-fees requirement.</p>
          <p className="programme-impact"><b>YOUR CONTRIBUTION CAN HELP A CHILD REMAIN IN SCHOOL, CONTINUE LEARNING, SIT IMPORTANT EXAMINATIONS, ACCESS ESSENTIAL MATERIALS AND MOVE CLOSER TO THEIR DREAMS.</b></p>
        </div>
      </section>

      {/* To Contribute */}
      <section className="section programme-contribute">
        <div className="container programme-contribute-inner">
          <p className="eyebrow"><i /> TO CONTRIBUTE — ACCOUNTABILITY STANDARDS</p>
          <h2>Pay directly.<br /><em>Send us a note.</em></h2>
          <p className="programme-contribute-lede">M-Pesa contributions are sent directly to the school of the child you choose.</p>
          <ul className="programme-list">
            <li><b>Use the student&apos;s Paybill & Account</b> shown on their card or full profile.</li>
            <li><b>Send us a note</b> after payment so we can credit your contribution and issue an accountability report.</li>
            <li><b>Any amount will be appreciated.</b></li>
          </ul>
          <div className="programme-buttons">
            <Link href="/students" className="button button-secondary">Pick a student <span>↗</span></Link>
          </div>
        </div>
      </section>

      {/* Hashtags */}
      <section className="section programme-section programme-section-tight">
        <div className="container programme-narrow programme-narrow-center">
          <p className="eyebrow"><i /> CALL TO ACTION</p>
          <h2 className="programme-cta-heading">ADOPT-A-STUDENT.<br /><em>Give today.</em></h2>
          <ul className="hashtags">{hashtags.map(h => <li key={h}>{h}</li>)}</ul>
        </div>
      </section>

      <ActionBand title="Every child deserves a chance to learn." text="ADOPT-A-STUDENT. Give today — and pay directly to keep a child in school." variant="jabu" />
    </SiteShell>
  )
}
