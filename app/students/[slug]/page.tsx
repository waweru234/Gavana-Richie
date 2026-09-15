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
    <PageIntro eyebrow="ADOPT-A-STUDENT PROGRAMME" title={student.name.split(' ')[0]} accent={student.name.split(' ').slice(1).join(' ')} text={student.short} />
    <StatStrip items={[{ value: student.need, label: 'needed to continue' }, { value: student.paybill, label: 'M-Pesa Paybill' }, { value: student.account, label: 'Account number' }, { value: '100%', label: 'purpose-led giving' }]} />
    <section className="section student-detail"><div className="container student-detail-grid">
      <div className="student-detail-art"><div className="student-detail-circle" /><img src={student.poster} alt={student.name} /><span className="student-detail-badge">{student.number} · {student.tag.toUpperCase()}</span></div>
      <div className="student-detail-copy">
        <p className="eyebrow"><i /> {student.tag.toUpperCase()}</p>
        <h2>{student.name}</h2>
        <p className="school">{student.school}</p>
        {student.bio.map((para, i) => <p key={i}>{para}</p>)}
        <div className="student-payment-box">
          <div><span>PAYBILL</span><b>{student.paybill}</b></div>
          <div><span>ACCOUNT</span><b>{student.account}</b></div>
          <div><span>NEEDED</span><b>{student.need}</b></div>
        </div>
        <div className="student-detail-actions">
          <Link href="/donate" className="button button-primary">Support {student.name.split(' ')[0]} <span>↗</span></Link>
          <Link href="/students" className="text-link">← Back to all students</Link>
        </div>
      </div>
    </div></section>
    <ActionBand title="No bright mind left behind." text="Choose a student, give what you can, and become part of their next chapter." />
  </SiteShell>
}
