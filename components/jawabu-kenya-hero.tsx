import Link from 'next/link'

export function JawabuKenyaHero({ compact = false }: { compact?: boolean }) {
  return (
    <section className={'jawabu-hero' + (compact ? ' jawabu-hero-compact' : '')}>
      <div className="jawabu-hero-bg" aria-hidden>
        <span className="jawabu-hero-blob jawabu-hero-blob-a" />
        <span className="jawabu-hero-blob jawabu-hero-blob-b" />
      </div>

      <div className="container jawabu-hero-grid">
        <div className="jawabu-hero-art">
          <div className="jawabu-hero-ring" aria-hidden />
          <img src="/jawabu-kenya-logo.png" alt="Jawabu Kenya - Milimani Estate, Elgeyo Road - PO Box 124 - 20100, Nakuru" />
          {!compact && <span className="jawabu-mark" aria-label="dot">*</span>}
          {compact && <span className="jawabu-hero-tag">PROGRAMME PARTNER</span>}
        </div>

        <div className="jawabu-hero-copy">
          <p className="eyebrow"><i /> ADOPT-A-STUDENT - A PROGRAMME OF</p>

          <h2 className="jawabu-hero-name">
            <em className="jawabu-hero-script">Jawabu</em>
            <span className="jawabu-hero-key">Kenya</span>
          </h2>

          <p className="jawabu-hero-tagline">The people behind every child kept in school.</p>

          <p className="jawabu-hero-lede">
            ADOPT-A-STUDENT runs under the Jawabu Kenya banner &mdash; a Nakuru-based programme dedicated to mobilising
            individuals, families, businesses, faith communities and well-wishers to keep vulnerable children in school
            through school fees, examinations and the essentials that make learning possible.
          </p>

          <ul className="jawabu-hero-meta">
            <li className="address-serif">
              <span className="jawabu-hero-meta-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.41 7.35 11.66a1 1 0 0 0 1.3 0C12.95 21.41 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" /></svg>
              </span>
              <span>
                <b>Office</b>
                <span>Milimani Estate, Elgeyo Road</span>
                <span>PO Box 124 &ndash; 20100, Nakuru</span>
              </span>
            </li>
          </ul>

          {!compact && (
            <div className="jawabu-hero-actions">
              <Link href="/students" className="button button-primary">Meet the students <span>-</span></Link>
              <Link href="#why-adopt" className="text-link jawabu-hero-anchor">About the programme <span>-</span></Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
