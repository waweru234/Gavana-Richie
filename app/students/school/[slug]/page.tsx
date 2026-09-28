import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'
import { JawabuKenyaBanner } from '@/components/jawabu-kenya-banner'
import { JawabuKenyaHero } from '@/components/jawabu-kenya-hero'
import { getAllPublishedStudents } from '@/lib/students'
import { StudentImage } from '@/components/student-image'
import { getDirectImageUrl } from '@/lib/utils'

const siteUrl = 'https://www.gavanarichie.com'

interface SchoolPageProps {
  params: Promise<{ slug: string }>
}

const createSchoolSlug = (schoolName: string) =>
  schoolName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function getSchoolStudents(slug: string) {
  const data = await getAllPublishedStudents()

  if (!data?.length) return null

  const schoolStudents = data.filter(
    (student) => createSchoolSlug(student.school) === slug,
  )

  if (!schoolStudents.length) return null

  return schoolStudents
}

export async function generateStaticParams() {
  const students = await getAllPublishedStudents()

  if (!students?.length) return []

  const schools = Array.from(
    new Set(students.map((student) => student.school.trim()).filter(Boolean)),
  )

  return schools.map((school) => ({
    slug: createSchoolSlug(school),
  }))
}

export async function generateMetadata({
  params,
}: SchoolPageProps): Promise<Metadata> {
  const { slug } = await params
  const schoolStudents = await getSchoolStudents(slug)

  if (!schoolStudents) return {}

  const schoolName = schoolStudents[0].school
  const sponsoredCount = schoolStudents.filter((student) => student.sponsored).length
  const studentCount = schoolStudents.length
  const firstImage = getDirectImageUrl(schoolStudents[0].image) ?? `${siteUrl}/richie-portrait.jpeg`
  const description = `${studentCount} student${studentCount === 1 ? '' : 's'} from ${schoolName} ${sponsoredCount ? `(${sponsoredCount} sponsored) ` : ''}available for support through ADOPT-A-STUDENT.`

  return {
    title: `${schoolName} Students | Adopt-A-Student`,
    description,
    keywords: [
      `${schoolName} students`,
      'adopt a student',
      'school fees',
      'education support',
      'Nakuru students',
    ],
    authors: [{ name: 'Richie Githatu' }],
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      url: `${siteUrl}/students/school/${slug}`,
      title: `${schoolName} Students | Adopt-A-Student`,
      description,
      siteName: 'Nakuru Kwetu',
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: `${schoolName} students`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${schoolName} Students | Adopt-A-Student`,
      description,
      images: [firstImage],
    },
    alternates: {
      canonical: `${siteUrl}/students/school/${slug}`,
    },
  }
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params
  const schoolStudents = await getSchoolStudents(slug)

  if (!schoolStudents) notFound()

  const schoolName = schoolStudents[0].school
  const sponsoredStudents = schoolStudents.filter((student) => student.sponsored)
  const unsponsoredStudents = schoolStudents.filter((student) => !student.sponsored)
  const schoolSlug = createSchoolSlug(schoolName)

  return (
    <SiteShell>
      <JawabuKenyaHero />
      <span className="jawabu-stripe" aria-hidden="true" />

      <PageIntro
        eyebrow="ADOPT-A-STUDENT · SCHOOL"
        title="Students from"
        accent={schoolName}
        text={`${schoolStudents.length} student${schoolStudents.length === 1 ? '' : 's'} from this school are listed for support.`}
      />

      <section id="school-students" className="section students school-students-page">
        <div className="container">
          <div className="school-page-top" data-reveal="fade-up">
            <Link href="/students" className="back-link">
              <span aria-hidden="true">←</span> All schools
            </Link>

            <div className="school-page-heading">
              <div>
                <p className="eyebrow"><i /> SCHOOL STUDENT DIRECTORY</p>
                <h2>
                  {schoolName}
                  <br />
                  <em>Students needing support.</em>
                </h2>
              </div>

              <p className="school-page-description">
                Browse every student currently listed from {schoolName}. Select a profile to
                see their education needs and the payment details provided for direct support.
              </p>
            </div>
          </div>

          <div className="school-summary-grid" data-reveal="stagger">
            <div className="school-summary-card">
              <span className="school-summary-label">TOTAL STUDENTS</span>
              <strong>{schoolStudents.length}</strong>
              <span>Students listed from this school</span>
            </div>
            <div className="school-summary-card">
              <span className="school-summary-label">NEEDING SUPPORT</span>
              <strong>{unsponsoredStudents.length}</strong>
              <span>Students currently available for support</span>
            </div>
            <div className="school-summary-card">
              <span className="school-summary-label">SPONSORED</span>
              <strong>{sponsoredStudents.length}</strong>
              <span>Students whose support has been covered</span>
            </div>
          </div>

          <div className="student-grid school-student-grid" data-reveal="stagger">
            {schoolStudents.map((student) => (
              <Link
                href={`/students/${student.slug}`}
                className={`student-card student-card-link${student.sponsored ? ' student-card-sponsored' : ''}`}
                key={student.id}
              >
                <div className="student-image">
                  <StudentImage
                    src={getDirectImageUrl(student.image)}
                    alt={`${student.name} student profile`}
                    loading="lazy"
                  />

                  <div className="student-image-overlay" aria-hidden="true" />

                  {student.sponsored && (
                    <span className="student-sponsored-badge">
                      <span className="student-sponsored-tick" aria-hidden="true">✓</span>
                      SPONSORED
                    </span>
                  )}

                  <span className="student-number">
                    {student.number} · {student.tag.toUpperCase()}
                  </span>
                </div>

                <div className="student-body">
                  <span className="label">{student.name.toUpperCase()}</span>
                  <h3>{student.school}</h3>
                  <p>{student.short || student.need}</p>

                  <div className="student-details">
                    <span>PAY BILL <b>{student.paybill}</b></span>
                    <span>ACCOUNT <b>{student.account}</b></span>
                  </div>

                  {student.sponsored ? (
                    <div className="need need-sponsored">
                      <b>✓ FULLY SPONSORED</b>
                      <span>
                        {student.sponsoredBy
                          ? `Covered by ${student.sponsoredBy}${student.sponsoredDate ? ` · ${student.sponsoredDate}` : ''}`
                          : 'Already covered · view their success story'}
                      </span>
                    </div>
                  ) : (
                    <div className="need">
                      <b>{student.need}</b>
                      <span>Goal · any amount will help</span>
                    </div>
                  )}

                  <span className="card-link">
                    View {student.sponsored ? 'success story' : 'full profile'} <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <JawabuKenyaBanner />
        </div>
      </section>

      <section id="school-info" className="section programme-section school-info-section">
        <div className="container programme-narrow">
          <p className="eyebrow"><i /> ABOUT {schoolName.toUpperCase()}</p>
          <h2>
            Supporting students
            <br />
            <em>at {schoolName}.</em>
          </h2>
          <p>
            This school directory brings together the students currently listed from {schoolName}
            so supporters can easily find the right student and access the payment information
            attached to their profile.
          </p>
          <p>
            Support is intended to help reduce the effect of financial hardship on a child&apos;s
            education. Payments should be made using the payment information displayed on the
            selected student&apos;s profile.
          </p>
        </div>
      </section>

      <section className="section programme-section">
        <div className="container programme-narrow">
          <p className="eyebrow"><i /> HOW TO HELP</p>
          <h2>
            Support a student
            <br />
            <em>from {schoolName}.</em>
          </h2>

          <div className="how-to-help-grid">
            <article className="help-card">
              <span className="help-number">01</span>
              <h3>Select a student</h3>
              <p>Choose a student above and open their profile to understand the support they need.</p>
            </article>
            <article className="help-card">
              <span className="help-number">02</span>
              <h3>Pay directly</h3>
              <p>Use the M-Pesa Paybill and account displayed on the student&apos;s profile.</p>
            </article>
            <article className="help-card">
              <span className="help-number">03</span>
              <h3>Notify the campaign</h3>
              <p>Send a note after payment so the contribution can be recorded for accountability.</p>
            </article>
          </div>

          <div className="programme-buttons">
            <Link href="/students" className="button button-secondary">
              ← Back to all schools
            </Link>
            <Link href={`/students/school/${schoolSlug}`} className="button button-primary">
              View this school <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <ActionBand
        title={`Support students from ${schoolName}`}
        text="ADOPT-A-STUDENT. Give today — and pay directly to keep a child in school."
        variant="jabu"
      />
    </SiteShell>
  )
}
