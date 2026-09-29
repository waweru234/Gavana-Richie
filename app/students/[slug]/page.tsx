import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ActionBand, PageIntro, SiteShell } from '@/components/site-shell'
import { JawabuKenyaBanner } from '@/components/jawabu-kenya-banner'
import { getStudentBySlug, getPublishedStudents } from '@/lib/students'
import { StudentImage } from '@/components/student-image'
import { getDirectImageUrl } from '@/lib/utils'

const siteUrl = 'https://www.gavanarichie.com'

interface StudentDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Generate all student routes at build time.
 */
export async function generateStaticParams() {
  const { data: students } = await getPublishedStudents(1, 500)

  if (!students) {
    return []
  }

  return students.map((student) => ({
    slug: student.slug,
  }))
}

/**
 * Generate SEO metadata for each student.
 */
export async function generateMetadata({
  params,
}: StudentDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  const student = await getStudentBySlug(slug)

  if (!student) {
    return {}
  }

  const studentUrl = `${siteUrl}/students/${student.slug}`

  const description =
    student.short ||
    student.need ||
    `Support ${student.name} through the ADOPT-A-STUDENT programme.`

  const imageUrl =
    getDirectImageUrl(student.poster || student.image) ||
    `${siteUrl}/placeholder.jpg`

  const title = student.sponsored
    ? `${student.name} — Sponsored Student | Richie Githatu 2027`
    : `${student.name} — Adopt a Student | Richie Githatu 2027`

  return {
    title,
    description,

    keywords: [
      student.name,
      student.school,
      'adopt a student',
      'school fees',
      'education support',
      'Nakuru students',
      'ADOPT-A-STUDENT',
    ],

    authors: [
      {
        name: 'Richie Githatu',
      },
    ],

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: studentUrl,
    },

    openGraph: {
      type: 'profile',
      url: studentUrl,
      title,
      description,
      siteName: 'Nakuru Kwetu',

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${student.name} — ${student.school}`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

/**
 * Student detail page.
 */
export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { slug } = await params

  const student = await getStudentBySlug(slug)

  if (!student) {
    notFound()
  }

  const firstName = student.name.split(' ')[0]
  const restName = student.name.split(' ').slice(1).join(' ')

  const imageUrl =
    getDirectImageUrl(student.poster || student.image) ||
    '/placeholder.jpg'

  const isSponsored = Boolean(student.sponsored)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',

    name: student.name,

    url: `${siteUrl}/students/${student.slug}`,

    image: imageUrl,

    description:
      student.short ||
      student.need ||
      `Student at ${student.school}.`,

    affiliation: {
      '@type': 'EducationalOrganization',
      name: student.school,
    },
  }

  return (
    <SiteShell>
      {/* =========================================================
          STRUCTURED DATA
      ========================================================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* =========================================================
          PAGE INTRO
      ========================================================= */}
      <PageIntro
        eyebrow={
          isSponsored
            ? 'SPONSORED STUDENT · SUCCESS STORY'
            : 'ADOPT-A-STUDENT'
        }
        title={firstName}
        accent={restName}
        text={
          student.short ||
          student.need ||
          `Support ${student.name} through the ADOPT-A-STUDENT programme.`
        }
      />

      {/* =========================================================
          STUDENT DETAIL
      ========================================================= */}
      <section
        id="student-profile"
        className="section student-detail"
      >
        <div className="container student-detail-grid">

          {/* =====================================================
              LEFT — STUDENT IMAGE
          ===================================================== */}
          <div className="student-detail-art">

            <div
              className="student-detail-circle"
              aria-hidden="true"
            />

            <div className="student-detail-image-wrap">
              <StudentImage
                src={imageUrl}
                alt={`${student.name} from ${student.school}`}
                loading="eager"
              />
            </div>

            <div className="student-detail-badge">
              <span>
                {student.number}
              </span>

              <span aria-hidden="true">
                ·
              </span>

              <span>
                {student.tag.toUpperCase()}
              </span>
            </div>

            {isSponsored && (
              <div className="student-sponsored-badge student-sponsored-badge-large">
                <span
                  className="student-sponsored-tick"
                  aria-hidden="true"
                >
                  ✓
                </span>

                FULLY SPONSORED
              </div>
            )}
          </div>

          {/* =====================================================
              RIGHT — STUDENT INFORMATION
          ===================================================== */}
          <div className="student-detail-copy">

            <p className="eyebrow">
              <i aria-hidden="true" />
              {student.tag.toUpperCase()}
            </p>

            <h2>
              {student.name}
            </h2>

            <p className="school">
              {student.school}
            </p>

            {/* =================================================
                FUNDING / SPONSORSHIP STATUS
            ================================================= */}
            {isSponsored ? (
              <div className="student-raise student-raise-sponsored">

                <span className="student-raise-eyebrow">
                  {firstName.toUpperCase()} HAS BEEN SPONSORED
                </span>

                <strong className="student-raise-amount">
                  ✓ FULLY SPONSORED
                </strong>

                <span className="student-raise-note">
                  {student.sponsoredBy ? (
                    <>
                      Covered by{' '}
                      <b>
                        {student.sponsoredBy}
                      </b>

                      {student.sponsoredDate && (
                        <>
                          {' '}
                          · {student.sponsoredDate}
                        </>
                      )}
                    </>
                  ) : (
                    'A donor has stepped in to support this student.'
                  )}

                  {' · '}

                  <b>
                    {student.need}
                  </b>{' '}
                  met.
                </span>
              </div>
            ) : (
              <div className="student-raise">

                <span className="student-raise-eyebrow">
                  MONEY BEING RAISED TO KEEP{' '}
                  {firstName.toUpperCase()}{' '}
                  IN SCHOOL
                </span>

                <strong className="student-raise-amount">
                  {student.need}
                </strong>

                <span className="student-raise-note">
                  Pay directly to{' '}
                  <b>
                    {student.school}
                  </b>
                  {' · '}
                  Any amount will be appreciated.
                </span>
              </div>
            )}

            {/* =================================================
                STUDENT BIO
            ================================================= */}
            {Array.isArray(student.bio) &&
              student.bio.length > 0 && (
                <div className="student-bio">
                  {student.bio.map((paragraph, index) => (
                    <p key={`${student.id}-bio-${index}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

            {/* =================================================
                SPONSORED STUDENT
            ================================================= */}
            {isSponsored ? (
              <>
                {student.sponsoredQuote && (
                  <blockquote className="student-sponsored-quote">
                    <span
                      className="quote-mark"
                      aria-hidden="true"
                    >
                      “
                    </span>

                    <p>
                      {student.sponsoredQuote}
                    </p>
                  </blockquote>
                )}

                <div className="student-payment-box student-payment-box-sponsored">

                  <div>
                    <span>
                      STATUS
                    </span>

                    <b>
                      Fully covered
                    </b>
                  </div>

                  <div>
                    <span>
                      GOAL
                    </span>

                    <b>
                      {student.need}
                    </b>
                  </div>

                  <div>
                    <span>
                      COVERED BY
                    </span>

                    <b>
                      {student.sponsoredBy ||
                        'Adopt-a-Student supporter'}
                    </b>
                  </div>

                </div>

                <div className="student-detail-actions">

                  <Link
                    href={`/students/school/${createSchoolSlug(
                      student.school,
                    )}`}
                    className="button button-primary"
                  >
                    ← Back to school
                  </Link>

                  <Link
                    href="/students#meet-students"
                    className="button"
                  >
                    Adopt the next student
                    <span aria-hidden="true">
                      ↗
                    </span>
                  </Link>

                  <Link
                    href="/students#why-adopt"
                    className="text-link"
                  >
                    About the programme
                    <span aria-hidden="true">
                      →
                    </span>
                  </Link>

                </div>
              </>
            ) : (
              <>
                {/* =============================================
                    PAYMENT INFORMATION
                ============================================= */}
                <div className="student-payment-box">

                  <div>
                    <span>
                      PAYBILL
                    </span>

                    <b>
                      {student.paybill}
                    </b>
                  </div>

                  <div>
                    <span>
                      ACCOUNT
                    </span>

                    <b>
                      {student.account}
                    </b>
                  </div>

                  <div>
                    <span>
                      AMOUNT
                    </span>

                    <b>
                      Any amount
                    </b>
                  </div>

                </div>

                <p className="student-detail-note">
                  After paying, send us a note so we can
                  credit your contribution to{' '}
                  <b>
                    {firstName}
                  </b>{' '}
                  and share an accountability report.
                </p>

                {/* =============================================
                    ACTIONS
                ============================================= */}
                <div className="student-detail-actions">

                  <Link
                    href={`/students/school/${createSchoolSlug(
                      student.school,
                    )}`}
                    className="button button-primary"
                  >
                    ← Back to school
                  </Link>

                  <Link
                    href="/students#meet-students"
                    className="text-link"
                  >
                    View all students
                    <span aria-hidden="true">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/students#why-adopt"
                    className="text-link"
                  >
                    About the programme
                    <span aria-hidden="true">
                      →
                    </span>
                  </Link>

                </div>
              </>
            )}

            {/* =================================================
                JAWABU BANNER
            ================================================= */}
            <div className="student-jawabu-strip">
              <JawabuKenyaBanner compact />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SCHOOL CONTEXT
      ========================================================= */}
      <section className="section student-school-context">
        <div className="container">

          <div className="student-school-context-inner">

            <div>
              <p className="eyebrow">
                <i aria-hidden="true" />
                SCHOOL
              </p>

              <h2>
                {student.school}
              </h2>

              <p>
                {isSponsored
                  ? `${firstName} is one of the students from ${student.school} featured in the ADOPT-A-STUDENT programme.`
                  : `${firstName} is a student from ${student.school} who is currently seeking education support through the ADOPT-A-STUDENT programme.`}
              </p>
            </div>

            <Link
              href={`/students/school/${createSchoolSlug(
                student.school,
              )}#school-students`}
              className="button button-secondary"
            >
              View students from this school
              <span aria-hidden="true">
                →
              </span>
            </Link>

          </div>

        </div>
      </section>

      {/* =========================================================
          CALL TO ACTION
      ========================================================= */}
      <ActionBand
        title={
          isSponsored
            ? `${firstName} is sponsored — who's next?`
            : 'No bright mind left behind.'
        }
        text={
          isSponsored
            ? 'Stand with the next student — another young person is waiting in this programme.'
            : 'Choose a student, give what you can, and become part of their next chapter.'
        }
      />
    </SiteShell>
  )
}

/**
 * Create the same school slug used by the
 * /students/school/[school-slug] page.
 *
 * Keeping this logic identical is important because
 * student detail pages link back to their school page.
 */
function createSchoolSlug(schoolName: string) {
  return schoolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
