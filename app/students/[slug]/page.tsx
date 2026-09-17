import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ActionBand, PageIntro, SiteShell, StatStrip } from '@/components/site-shell'
import { studentProfiles } from '@/lib/student-profiles'

export function generateStaticParams() {
  return studentProfiles.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const student = studentProfiles.find(s => s.slug === slug)
  if (!student) return {}
  return {
    title: `${student.name} — Adopt a Student | Richie Githatu 2027`,
    description: student.short,
    alternates: { canonical: `/students/${student.slug}` },
    openGraph: { title: `${student.name} — Adopt a Student`, description: student.short, images: [{ url: student.poster, alt: student.name }] },
  }
}

export default async function StudentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const student = studentProfiles.find(s => s.slug === slug)
  if (!student) notFound()

return <SiteShell>
 <PageIntro eyebrow="ADOPT-A-STUDENT" title={student.name.split(' ')[0]} accent={student.name.split(' ').slice(1).join(' ')} text={student.short} />
      <section className="section student-detail"><div className="container student-detail-grid">
      <div className="student-detail-art"><div className="student-detail-circle" /><img src={student.poster} alt={student.name} /><span className="student-detail-badge">{student.number} · {student.tag.toUpperCase()}</span></div>
      <div className="student-detail-copy">
        <p className="eyebrow"><i /> {student.tag.toUpperCase()}</p>
        <h2>{student.name}</h2>
        <p className="school">{student.school}</p>

        <div className="student-raise">
          <span className="student-raise-eyebrow">MONEY BEING RAISED TO KEEP {student.name.split(' ')[0].toUpperCase()} IN SCHOOL</span>
          <strong className="student-raise-amount">{student.need}</strong>
          <span className="student-raise-note">Pay directly to <b>{student.school}</b> · Any amount will be appreciated</span>
        </div>

        {student.bio.map((para, i) => <p key={i}>{para}</p>)}

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
      </div>
    </div></section>
    <ActionBand title="No bright mind left behind." text="Choose a student, give what you can, and become part of their next chapter." />
  </SiteShell>
}
