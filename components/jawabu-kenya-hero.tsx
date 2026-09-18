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
          <img src="/jawabu-kenya-logo.png" alt="Jawabu Kenya Â· Milimani Estate, Elgeyo Road Â· PO Box 124 - 20100, Nakuru" />
          {!compact && <span className="jawabu-·-mark" aria-label="·">·</span>}
          {compact && <span className="jawabu-hero-tag">PROGRAMME PARTNER</span>}
        </div>

        <div className="jawabu-hero-copy">
          <p className="eyebrow"><i /> ADOPT-A-STUDENT Â· A PROGRAMME OF</p>

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
            <li>
              <span className="jawabu-hero-meta-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a14.21 14.21 0 0 0 6.38 6.38l2.13-2.13a1 1 0 0 1 1.05-.24 11.65 11.65 0 0 0 3.65.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.62a1 1 0 0 1 1 1 11.65 11.65 0 0 0 .58 3.65 1 1 0 0 1-.24 1.05l-2.34 2.09Z" /></svg>
              </span>
              <span>
                <b>Call</b>
                <a href="tel:+254716774555">+254 716 774 555</a>
                <a href="tel:+254738972179">+254 738 972 179</a>
              </span>
            </li>
          </ul>

          {!compact && (
            <div className="jawabu-hero-actions">
              <Link href="/students" className="button button-primary">Meet the students <span>â†—</span></Link>
              <Link href="#why-adopt" className="text-link jawaban-hero-anchor">About the programme <span>â†“</span></Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
