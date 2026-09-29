import type { Metadata } from 'next'
import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'
import { JawabuKenyaBanner } from '@/components/jawabu-kenya-banner'
import { JawabuKenyaHero } from '@/components/jawabu-kenya-hero'
import { getAllPublishedStudents } from '@/lib/students'
import { StudentImage } from '@/components/student-image'
import { getDirectImageUrl } from '@/lib/utils'

const siteUrl = 'https://www.gavanarichie.com'
const DIRECTORY_ITEMS_PER_PAGE = 6

type Student = Awaited<ReturnType<typeof getAllPublishedStudents>>[number]

interface StudentsPageProps {
  searchParams: Promise<{ page?: string }>
}

const getNeedAmount = (need: string) => {
  const amount = Number(need.replace(/[^0-9.]/g, ''))
  return Number.isFinite(amount) ? amount : 0
}

const createSchoolSlug = (schoolName: string) =>
  schoolName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

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
  { title: 'Partnership & Collective Action', text: 'Keeping a child in school becomes everyone&rsquo;s responsibility.' },
]

const objectives = [
  'Mobilise resources to support school fees for vulnerable children.',
  'Prevent school interruption and dropout caused by financial hardship.',
  'Build a network of individual and institutional education sponsors.',
  'Encourage community ownership of education support.',
  'Establish transparent beneficiary identification and disbursement mechanisms.',
  'Promote education support as an investment in the community&rsquo;s future.',
]

const beneficiaries = [
  'Children from extremely vulnerable households and orphans/vulnerable children.',
  'Children affected by unemployment, loss of livelihood, disasters or emergencies.',
  'Children at risk of dropping out because of accumulated school fees.',
  'Children whose parents/guardians cannot meet essential education costs.',
]

const hashtags = ['#KeepAChildInSchool', '#EveryChildDeservesAChance', '#EducationForAll', '#YourSupportTheirFuture', '#InvestInEducation']

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams
  const requestedPage = Number(params.page ?? '1')
  const validRequestedPage = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1

  // Load the complete published directory before grouping so no school or
  // student is omitted from the directory.
  const allStudents: Student[] = await getAllPublishedStudents()
  const total = allStudents.length

  if (!allStudents || allStudents.length === 0) {
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
        <ActionBand title="Every child deserves a chance to learn." text="ADOPT-A-STUDENT. Give today - and pay directly to keep a child in school." variant="jabu" />
      </SiteShell>
    )
  }

  const schoolGroups = new Map<string, { school: string; students: Student[] }>()
  allStudents.filter((student) => !student.sponsored).forEach((student) => {
    const schoolName = student.school.trim().replace(/\s+/g, ' ')
    const schoolKey = schoolName.toLocaleLowerCase()
    const group = schoolGroups.get(schoolKey)
    if (group) {
      group.students.push(student)
    } else {
      schoolGroups.set(schoolKey, { school: schoolName, students: [student] })
    }
  })

  const schoolEntries = [...schoolGroups.values()].map(({ school, students }) => ({
    type: 'school' as const,
    school,
    students: students.sort((a, b) => getNeedAmount(b.need) - getNeedAmount(a.need)),
    sortAmount: Math.max(...students.map((student) => getNeedAmount(student.need))),
  }))
  const sponsoredEntries = allStudents
    .filter((student) => student.sponsored)
    .map((student) => ({
      type: 'student' as const,
      student,
      sortAmount: getNeedAmount(student.need),
    }))
  const directoryEntries = [...schoolEntries, ...sponsoredEntries]
    .sort((a, b) => b.sortAmount - a.sortAmount)
  const totalDirectoryEntries = directoryEntries.length
  const totalDirectoryPages = Math.max(
    1,
    Math.ceil(totalDirectoryEntries / DIRECTORY_ITEMS_PER_PAGE),
  )
  const page = Math.min(validRequestedPage, totalDirectoryPages)
  const startIndex = (page - 1) * DIRECTORY_ITEMS_PER_PAGE
  const paginatedDirectoryEntries = directoryEntries.slice(
    startIndex,
    startIndex + DIRECTORY_ITEMS_PER_PAGE,
  )

  return (
    <SiteShell>
      <JawabuKenyaHero />
      <span className="jawabu-stripe" aria-hidden />

      <PageIntro
        eyebrow="ADOPT-A-STUDENT"
        title="Every child"
        accent="deserves education."
        text="Browse students by school, or read a sponsored student’s story."
      />

      {/* STUDENTS FIRST */}
      <section id="meet-students" className="section students">
        <div className="container">
          <div className="section-heading" data-reveal="fade-up">
            <div>
              <p className="eyebrow"><i /> MEET THE STUDENTS</p>
              <h2>Pick a student.<br /><em>Pay the school directly.</em></h2>
            </div>
            <p>Browse students by school. Sponsored students appear as individual stories, and single-student schools are included. Folders are ordered by the highest student need. ({total} students listed)</p>
          </div>

          <div className="school-groups-grid" data-reveal="stagger">
            {paginatedDirectoryEntries.map((entry, entryIndex) => {
              if (entry.type === 'student') {
                const student = entry.student

                return (
                  <Link
                    href={`/students/${student.slug}`}
                    className="school-group-link sponsored-standalone"
                    aria-label={`View sponsored student ${student.name}`}
                    key={student.id || student.slug || entryIndex}
                  >
                    <div className="school-group-card">
                      <div className="school-group-header">
                        <div>
                          <p className="school-group-eyebrow">SPONSORED STUDENT</p>
                          <h3>{student.name}</h3>
                        </div>
                        <span className="sponsored-tag">SPONSORED</span>
                      </div>
                      <div className="school-student-preview sponsored-standalone-preview">
                        <StudentImage
                          src={getDirectImageUrl(student.image)}
                          alt={`${student.name} profile`}
                          className="student-preview-image"
                          loading="lazy"
                        />
                        <div className="student-preview-info">
                          <span className="student-name">{student.school}</span>
                          <span className="school-sponsored-status">✓ FULLY SPONSORED</span>
                        </div>
                      </div>
                      <div className="school-group-action">
                        View success story <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                )
              }

              const { school, students } = entry
              const schoolSlug = createSchoolSlug(school)
              const studentCount = students.length
              const visibleStudents = students.slice(0, 3)

              return (
                <div key={school} className="school-group">
                  <Link
                    href={`/students/school/${schoolSlug}`}
                    className="school-group-link"
                    aria-label={`View ${studentCount} students needing support from ${school}`}
                  >
                    <div className="school-group-card">
                      <div className="school-group-header">
                        <div>
                          <p className="school-group-eyebrow">SCHOOL</p>
                          <h3>{school}</h3>
                        </div>
                        <span className="student-count">
                          {studentCount === 1 ? '1 student needs support' : `${studentCount} students need support`}
                        </span>
                      </div>

                      <div className="school-group-students">
                        {visibleStudents.map((student) => (
                          <div key={student.id} className="school-student-preview">
                            <StudentImage
                              src={getDirectImageUrl(student.image)}
                              alt={`${student.name} preview`}
                              className="student-preview-image"
                              loading="lazy"
                            />
                            <div className="student-preview-info">
                              <span className="student-name">{student.name}</span>
                            </div>
                          </div>
                        ))}
                        {studentCount > visibleStudents.length && (
                          <div className="preview-more">
                            +{studentCount - visibleStudents.length} more students
                          </div>
                        )}
                      </div>

                      <div className="school-group-action">
                        View {studentCount === 1 ? 'student' : 'all students'} from {school}
                        <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          {totalDirectoryPages > 1 && (
            <nav className="pagination" aria-label="Student directory pagination">
              {page > 1 && (
                <Link href={`/students?page=${page - 1}#meet-students`} className="pagination-btn" aria-label="Previous page">
                  <span aria-hidden="true">←</span> Previous
                </Link>
              )}
              <span className="pagination-info" aria-live="polite">
                Page {page} of {totalDirectoryPages} · {totalDirectoryEntries} school and sponsored-student listings
              </span>
              {page < totalDirectoryPages && (
                <Link href={`/students?page=${page + 1}#meet-students`} className="pagination-btn" aria-label="Next page">
                  Next <span aria-hidden="true">→</span>
                </Link>
              )}
            </nav>
          )}

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

      {/* Vision - Mission - Goal */}
      <section className="section programme-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> VISION - MISSION - GOAL</p>
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
            {objectives.map((o, i) => (
              <li key={i}>
                <b>0{i + 1}</b>
                <span>{o}</span>
              </li>
            ))}
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
            <p>Assistance is based on demonstrated need - not political, religious, ethnic, personal or social connections.</p>
          </div>
          <ul className="programme-list programme-list-box">
            {beneficiaries.map((b, i) => (
              <li key={i}>
                <b>0{i + 1}</b>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Donor Appeal */}
      <section className="section programme-contribute">
        <div className="container programme-contribute-inner">
          <p className="eyebrow"><i /> TO CONTRIBUTE - ACCOUNTABILITY STANDARDS</p>
          <h2>Pay directly.<br /><em>Send us a note.</em></h2>
          <p className="programme-contribute-lede">M-Pesa contributions are sent directly to the school of the child you choose.</p>
          <ul className="programme-list">
            <li><b>Use the student&apos;s Paybill & Account</b> shown on their card or full profile.</li>
            <li><b>Send us a note</b> after payment so we can credit your contribution and issue an accountability report.</li>
            <li><b>Any amount will be appreciated.</b></li>
          </ul>
          <div className="programme-buttons">
            <Link href="/students#meet-students" className="button button-secondary">Pick a student <span>-</span></Link>
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

      <ActionBand title="Every child deserves a chance to learn." text="ADOPT-A-STUDENT. Give today - and pay directly to keep a child in school." variant="jabu" />
    </SiteShell>
  )
}
