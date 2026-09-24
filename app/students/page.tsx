import type { Metadata } from 'next'
import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'
import { JawabuKenyaBanner } from '@/components/jawabu-kenya-banner'
import { JawabuKenyaHero } from '@/components/jawabu-kenya-hero'
import { getPublishedStudents } from '@/lib/students'

const siteUrl = 'https://www.gavanarichie.com'

export const metadata: Metadata = {
  title: 'Adopt a Student | Richie Githatu for Governor 2027',
  description: 'Join the ADOPT-A-STUDENT campaign. Pick a student, pay directly to their school, and help keep vulnerable children in Nakuru in school. Every shilling counts.',
  keywords: ['adopt a student', 'school fees', 'education support', 'Nakuru students', 'Richie Githatu'],
  authors: [{ name: 'Richie Githatu' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: `${siteUrl}/students`,
    title: 'Adopt a Student | Richie Githatu for Governor 2027',
    description: 'Join the ADOPT-A-STUDENT campaign. Pick a student, pay directly to their school, and help keep vulnerable children in Nakuru in school.',
    siteName: 'Nakuru Kwetu',
    images: [{ url: `${siteUrl}/richie-portrait.jpeg`, width: 1200, height: 630, alt: 'Adopt a Student' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adopt a Student | Richie Githatu for Governor 2027',
    description: 'Join the ADOPT-A-STUDENT campaign. Pick a student, pay directly to their school, and help keep vulnerable children in Nakuru in school.',
    images: [`${siteUrl}/richie-portrait.jpeg`],
  },
  alternates: {
    canonical: `${siteUrl}/students`,
  },
}

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

export default async function StudentsPage() {
  const students = await getPublishedStudents()

  if (!students || students.length === 0) {
    return (
      <SiteShell>
        <PageIntro
          eyebrow="ADOPT-A-STUDENT"
          title="Every child"
          accent="deserves education."
          text="A people-powered campaign to keep vulnerable children in school."
        />
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>No students are currently listed. Please check back soon.</p>
        </div>
        <ActionBand title="Every child deserves a chance to learn." text="ADOPT-A-STUDENT. Give today — and pay directly to keep a child in school." variant="jabu" />
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <JawabuKenyaHero />
      <span className="jawaban-stripe" aria-hidden />

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
            <p>Choose a student below to view their full profile. Use the M-Pesa details on their card or profile — payments go directly to their school. ({students.length} students ready for support)</p>
          </div>
          <div className="student-grid" data-reveal="stagger">
            {students.map(student => (
              <Link href={`/students/${student.slug}`} className={'student-card student-card-link' + (student.sponsored ? ' student-card-sponsored' : '')} key={student.id}>
                <div className="student-image">
                  <img src={student.image || '/placeholder-student.jpg'} alt={`${student.name} student profile`} loading="lazy" />
                  {student.sponsored && <span className="student-sponsored-badge"><span className="student-sponsored-tick" aria-hidden>✓</span> SPONSORED</span>}
                  <span>{student.number} · {student.tag.toUpperCase()}</span>
                </div>
                <div className="student-body">
                  <span className="label">{student.name.toUpperCase()}</span>
                  <h3>{student.school}</h3>
                  <p>{student.short || student.need}</p>
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
