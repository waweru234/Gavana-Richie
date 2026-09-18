import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'
import { JawabuKenyaBanner } from '@/components/jawabu-kenya-banner'
import { studentProfiles } from '@/lib/student-profiles'

export function generateStaticParams() {
  return studentProfiles.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const student = studentProfiles.find(s => s.slug === slug)
  if (!student) return {}
  return {
    title: `${student.name} — ${student.sponsored ? 'Sponsored' : 'Adopt a Student'} | Richie Githatu 2027`,
    description: student.short,
    alternates: { canonical: `/students/${student.slug}` },
    openGraph: { title: `${student.name} — ${student.sponsored ? 'Sponsored' : 'Adopt a Student'}`, description: student.short, images: [{ url: student.poster, alt: student.name }] },
  }
}

export default async function StudentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const student = studentProfiles.find(s => s.slug === slug)
  if (!student) notFound()

  return <SiteShell>
    <PageIntro
      eyebrow={student.sponsored ? 'SPONSORED STUDENT · SUCCESS STORY' : 'ADOPT-A-STUDENT'}
      title={student.name.split(' ')[0]}
      accent={student.name.split(' ').slice(1).join(' ')}
      text={student.short}
    />
    <section className="section student-detail"><div className="container student-detail-grid">
      <div className="student-detail-art">
        <div className="student-detail-circle" />
        <img src={student.poster} alt={student.name} />
        <span className="student-detail-badge">{student.number} · {student.tag.toUpperCase()}</span>
        {student.sponsored && <span className="student-sponsored-badge student-sponsored-badge-large"><span className="student-sponsored-tick" aria-hidden>✓</span> FULLY SPONSORED</span>}
      </div>
      <div className="student-detail-copy">
        <p className="eyebrow"><i /> {student.tag.toUpperCase()}</p>
        <h2>{student.name}</h2>
        <p className="school">{student.school}</p>

        {student.sponsored ? (
          <div className="student-raise student-raise-sponsored">
            <span className="student-raise-eyebrow">{student.name.split(' ')[0].toUpperCase()} HAS BEEN SPONSORED</span>
            <strong className="student-raise-amount">✓ FULLY SPONSORED</strong>
            <span className="student-raise-note">{student.sponsoredBy ? <>Covered by <b>{student.sponsoredBy}</b>{student.sponsoredDate ? ` · ${student.sponsoredDate}` : ''}</> : 'A donor has stepped in.'} · <b>Goal met</b></span>
          </div>
        ) : (
          <div className="student-raise">
            <span className="student-raise-eyebrow">MONEY BEING RAISED TO KEEP {student.name.split(' ')[0].toUpperCase()} IN SCHOOL</span>
            <strong className="student-raise-amount">{student.need}</strong>
            <span className="student-raise-note">Pay directly to <b>{student.school}</b> · Any amount will be appreciated</span>
          </div>
        )}

        {student.bio.map((para, i) => <p key={i}>{para}</p>)}

        {student.sponsored ? (
          <>
            {student.sponsoredQuote && (
              <blockquote className="student-sponsored-quote">{student.sponsoredQuote}</blockquote>
            )}
            <div className="student-payment-box student-payment-box-sponsored">
              <div><span>STATUS</span><b>Fully covered</b></div>
              <div><span>GOAL</span><b>{student.need}</b></div>
              <div><span>COVERED BY</span><b>{student.sponsoredBy ?? 'Adopt-a-Student supporter'}</b></div>
            </div>
            <div className="student-detail-actions">
              <Link href="/students" className="button button-primary">Back to all students</Link>
              <Link href="/students" className="button">Adopt the next student <span>↗</span></Link>
              <Link href="/students" className="text-link">About the programme <span>→</span></Link>
            </div>
          </>
        ) : (
          <>
            <div className="student-payment-box">
              <div><span>PAYBILL</span><b>{student.paybill}</b></div>
              <div><span>ACCOUNT</span><b>{student.account}</b></div>
              <div><span>AMOUNT</span><b>Any amount</b></div>
            </div>
            <p className="student-detail-note">After paying, send us a note so we can credit your contribution to <b>{student.name.split(' ')[0]}</b> and share an accountability report.</p>
            <div className="student-detail-actions">
              <Link href="/students" className="button button-primary">← Back to all students</Link>
              <Link href="/students" className="text-link">About the programme <span>→</span></Link>
            </div>
          </>
        )}

        <div className="student-jawabu-strip"><JawabuKenyaBanner compact /></div>
      </div>
    </div></section>
    <ActionBand
      title={student.sponsored ? 'Shawn is sponsored — who&apos;s next?' : 'No bright mind left behind.'}
      text={student.sponsored ? (student.sponsoredBy?.includes('supporter') ? 'Stand with Francis — the next student waiting in this programme.' : 'Stand with Francis — the next student waiting in this programme.') : 'Choose a student, give what you can, and become part of their next chapter.'}
    />
  </SiteShell>
}
