export function JawabuKenyaBanner({ compact = false }: { compact?: boolean }) {
  return (
    <article className={'jawabu-banner' + (compact ? ' jawabu-banner-compact' : '')}>
      <div className="jawabu-banner-art">
        <div className="jawabu-banner-glow" aria-hidden />
        <img src="/jawabu-kenya-logo.png" alt="Jawabu Kenya Â· Milimani Estate, Elgeyo Road, Nakuru" />
        <span className="jawabu-banner-stamp">SINCE NAKURU Â· KENYA</span>
        {!compact && <span className="jawabu-·-mark jawabu-·-mark-small" aria-label="·">·</span>}
      </div>

      <div className="jawabu-banner-copy">
        <p className="eyebrow"><i /> ADOPT-A-STUDENT PROGRAMME PARTNER</p>
        <h3><b>Jawabu</b> <em>Kenya</em></h3>
        <p className="jawabu-banner-tag"><b>·</b>ADOPT-A-STUDENT runs under the Jawabu Kenya banner &mdash; a Nakuru-based programme keeping vulnerable children in school.</p>

        <ul className="jawabu-banner-meta">
          <li className="address-serif">
            <span className="jawabu-banner-meta-icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.05 11.41 7.35 11.66a1 1 0 0 0 1.3 0C12.95 21.41 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" /></svg>
            </span>
            <span>
              <b>Office</b>
              <span>Milimani Estate, Elgeyo Road</span>
              <span>PO Box 124 &ndash; 20100, Nakuru</span>
</span>
          </li>
          {!compact && (
            <li>
              <span className="jawabu-banner-meta-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.46-.5 6.54 6.45 6.54-6.45H5.46Zm15.04 1-7.07 6.97a1 1 0 0 1-1.39 0L4.5 6V18.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V6Z" /></svg>
              </span>
              <span>
                <b>Programme</b>
                <span>ADOPT-A-STUDENT &middot; powered by Jawabu Kenya</span>
              </span>
            </li>
          )}
        </ul>
      </div>
    </article>
  )
}
