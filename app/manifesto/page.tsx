import Link from 'next/link'
import { ActionBand, PageIntro, SiteShell, StatStrip } from '@/components/site-shell'

type Pillar = {
  number: string
  title: string
  will: string[]
  outcomes: string[]
}

const pillars: Pillar[] = [
  {
    number: 'Pillar 01',
    title: 'Modern Infrastructure and Connectivity',
    will: [
      'Upgrade county roads linking farms, markets, schools, and clinics; expand urban roads in Nakuru City, Naivasha, Gilgil, Molo, Njoro, Bahati, Subukia, and Kuresoi.',
      'Build drainage systems to end urban flooding.',
      'Install smart traffic management, solar street lighting, and CCTV in major towns and markets.',
      'Redevelop bus parks into modern terminals with digital ticketing, sanitation, SACCO offices, retail space, security, and passenger information centres.',
    ],
    outcomes: ['Reduced transport costs', 'Improved road safety', 'Increased trade and investment', 'Better mobility and accessibility'],
  },
  {
    number: 'Pillar 02',
    title: 'Agricultural Transformation and Food Security',
    will: [
      'Establish agro-processing parks for dairy, potatoes, tomatoes, cereals, and horticulture.',
      'Strengthen cooperatives with affordable credit, extension services, and collective marketing.',
      'Cut post-harvest losses with cold storage and aggregation centres in every sub-county.',
      'Expand irrigation schemes, water harvesting, and climate-smart agriculture.',
    ],
    outcomes: ['Increased farm productivity', 'Higher household incomes', 'Enhanced food security', 'Increased exports and value addition'],
  },
  {
    number: 'Pillar 03',
    title: 'Affordable Housing and Smart Urban Development',
    will: [
      'Deliver affordable housing through public-private partnerships, prioritising low- and middle-income families, and upgrade informal settlements.',
      'Support satellite towns — Naivasha, Gilgil, Molo, Njoro, Bahati, Subukia, Mau Summit.',
      'Protect wetlands, riparian zones, forests, and open spaces; build urban parks and promote fruit-tree planting in schools and institutions.',
    ],
    outcomes: ['Reduced housing deficit', 'Improved urban living standards', 'Balanced regional development', 'Cleaner, greener towns'],
  },
  {
    number: 'Pillar 04',
    title: 'Universal Healthcare and Social Protection',
    will: [
      'Upgrade hospitals and health centres; ensure medicines, equipment, labs, and staffing; expand maternal and child health services.',
      'Establish a sustainable county-supported health insurance programme.',
      'Build modern ambulance and emergency response systems in every sub-county.',
      'Expand support for older persons, persons with disabilities, vulnerable households, and orphans.',
    ],
    outcomes: ['Improved healthcare access', 'Reduced disease burden', 'Lower healthcare costs', 'Improved quality of life'],
  },
  {
    number: 'Pillar 05',
    title: 'Education, Skills and Youth Empowerment',
    will: [
      'Construct and modernise ECDE centres, vocational training centres, and library and digital learning facilities.',
      'Increase bursary funding and introduce merit-based scholarships.',
      'Build ICT laboratories and promote coding, innovation, and entrepreneurship.',
      'Create Youth Innovation and Enterprise Centres, and support startups through financing and mentorship.',
      'Roll out a Labour-Based System for county projects that directly trains, equips, and empowers local fundis.',
    ],
    outcomes: ['Increased school retention', 'A skilled workforce', 'Reduced youth unemployment', 'Increased innovation and entrepreneurship'],
  },
  {
    number: 'Pillar 06',
    title: 'Water Security, Environment and Climate Action',
    will: [
      'Expand water supply infrastructure and cut non-revenue water losses.',
      'Restore Rivers Njoro, Gilgil, and Malewa; protect Lakes Nakuru, Naivasha, Elementaita, and Solai.',
      'Promote rainwater harvesting, restore degraded ecosystems, and back community-led conservation.',
      'Launch the Green Nakuru Initiative: 20 million trees planted in the first term, alongside renewable energy.',
    ],
    outcomes: ['Improved water access', 'Enhanced climate resilience', 'Restored ecosystems', 'Increased environmental sustainability'],
  },
  {
    number: 'Pillar 07',
    title: 'Tourism, Trade and Investment',
    will: [
      'Market Nakuru as Kenya&apos;s premier tourism and conference destination, and develop eco- and cultural-tourism circuits.',
      'Open a One-Stop Investment Centre, simplify licensing, and create industrial and logistics parks.',
      'Modernise markets, expand affordable business financing, and widen opportunities for women and youth entrepreneurs.',
    ],
    outcomes: ['Increased investment', 'More jobs', 'Higher county revenues', 'Growth of local enterprises'],
  },
  {
    number: 'Pillar 08',
    title: 'Good Governance, Accountability and Zero Corruption',
    will: [
      'Publish budgets, procurement awards, and expenditure reports online, and introduce citizen monitoring platforms.',
      'Hold regular ward and sub-county development forums; involve citizens in budgeting and prioritisation.',
      'Enforce transparent procurement, digitise services to close corruption gaps, and protect whistleblowers.',
      'Introduce performance contracts for county executives and chief officers, with published annual scorecards.',
    ],
    outcomes: ['Increased public trust', 'Improved service delivery', 'Better value for public resources', 'Increased investor confidence'],
  },
]

const values = [
  { title: 'Integrity & Accountability', text: 'Zero tolerance to corruption in the management of public resources.' },
  { title: 'Inclusive Leadership', text: 'Equitable development where no community is left behind.' },
  { title: 'Innovation & Excellence', text: 'Technology and continuous improvement in service delivery.' },
  { title: 'Sustainability', text: 'Responsible stewardship of our environment and resources.' },
]

export default function ManifestoPage() {
  return (
    <SiteShell>
      <PageIntro
        eyebrow="THE NAKURU TRANSFORMATION AGENDA"
        title="Solutions built for"
        accent="Nakuru&apos;s youth, first."
        text="A practical, ready-to-implement roadmap — anchored by two ideas that put county spending and county markets directly to work for young people, and built out across eight pillars of transformation."
      />

      <StatStrip
        items={[
          { value: '568', label: 'county contracts per term' },
          { value: '11/11', label: 'sub-counties served' },
          { value: '1,000,000', label: 'jobs targeted in term one' },
          { value: '20M', label: 'trees in our first term' },
        ]}
      />

      {/* Two leading ideas */}
      <section className="section leading-ideas">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> TWO IDEAS LEADING THIS MANIFESTO</p>
              <h2>Solutions built for<br /><em>Nakuru&apos;s youth, first.</em></h2>
            </div>
            <p>Before the eight pillars, two practical, ready-to-implement ideas that put county spending and county markets directly to work for young people.</p>
          </div>

          <div className="leading-ideas-grid">
            <article className="leading-idea leading-idea-navy">
              <div className="leading-idea-head">
                <span className="leading-idea-eyebrow">Vijana Na Tender</span>
                <h3>Every county tender,<br /><em>an internship guarantee.</em></h3>
              </div>
              <p>For every county tender above <strong>KSh 5 million</strong>, the winning contractor must take on 5 youth interns for 6 months. Their stipend is paid by the county — not deducted from the contractor&apos;s fee — so the obligation never becomes a reason to inflate a bid or cut corners on the job.</p>
              <ul className="leading-idea-features">
                <li><b>Attached</b> as a standard condition on every qualifying tender award.</li>
                <li><b>Local</b> interns drawn from the sub-county where the project is based, prioritising local youth.</li>
                <li><b>County pays</b> the stipend directly, keeping the incentive honest for contractors.</li>
                <li><b>Publicly tracked</b> placements alongside the procurement scorecard in <strong>Pillar 8</strong>.</li>
              </ul>
              <div className="leading-idea-callout">
                <strong>568</strong>
                <span>county contracts awarded in the two most recent financial years.</span>
                <p>At 5 interns per qualifying tender, that scale of procurement could translate into thousands of paid, structured youth placements every term — real work experience, funded without a new tax.</p>
              </div>
            </article>

            <article className="leading-idea leading-idea-red">
              <div className="leading-idea-head">
                <span className="leading-idea-eyebrow">Soko Bila Rent</span>
                <h3>A market day,<br /><em>without the shop rent.</em></h3>
              </div>
              <p>Too many young entrepreneurs start a business only to close it within a year — not for lack of a good product, but for lack of customers and the high cost of marketing and a physical shop. Soko Bila Rent puts the county behind regular market days held across every ward, open to businesses of all kinds.</p>
              <ul className="leading-idea-features">
                <li><b>Scheduled</b> market days rotating through all eleven sub-counties.</li>
                <li><b>Direct access</b> to customers — no shop rent, no paid advertising required to get started.</li>
                <li><b>Side-by-side stalls</b> let entrepreneurs see what similar businesses are doing and sharpen what makes theirs different.</li>
                <li><b>Ama kama wewe ni champe, utaona vile uko mbele ya compe</b> — and you can double down on exactly what sets you apart.</li>
              </ul>
              <div className="leading-idea-callout">
                <strong>0</strong>
                <span>shop rent required to reach your first paying customers.</span>
                <p>Pairs directly with Pillar 7&apos;s plan to modernise markets and Pillar 5&apos;s youth enterprise centres — one continuous ladder from first sale to registered business.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Foreword */}
      <section className="section manifesto-foreword">
        <div className="container manifesto-foreword-grid">
          <div>
            <p className="eyebrow"><i /> FOREWORD</p>
            <h2>A social contract with<br /><em>Nakuru.</em></h2>
          </div>
          <div>
            <p>Nakuru stands at a defining moment in its history. As Kenya&apos;s newest city and one of the country&apos;s most important economic, agricultural, tourism, and transport hubs, our county possesses immense potential — yet many of our people still face unemployment, inadequate infrastructure, limited healthcare, water shortages, housing deficits, and growing inequality.</p>
            <p>This manifesto is more than a political document; it is a social contract between my leadership and the people of Nakuru County — a practical, achievable roadmap for transforming our county into a model of prosperity, integrity, sustainability, and opportunity.</p>
            <p className="manifesto-foreword-sign"><b>Richard Muriuki</b><small>Candidate for Governor, Nakuru County</small></p>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="section manifesto-visions">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> THE TRANSFORMATION AGENDA</p>
              <h2>Vision, mission,<br /><em>and the values behind them.</em></h2>
            </div>
          </div>

          <div className="vm-grid">
            <article className="vm-card">
              <span className="vm-eyebrow">VISION</span>
              <p>To transform Nakuru into Kenya&apos;s leading model county — corruption-free, prosperous, inclusive, environmentally sustainable, and investment-friendly for agriculture, industry, tourism, trade, and innovation.</p>
            </article>
            <article className="vm-card">
              <span className="vm-eyebrow">MISSION</span>
              <p>To provide accountable leadership, deliver quality public services, unlock economic opportunities, create jobs, protect our environment, and improve the quality of life for every resident.</p>
            </article>
          </div>

          <div className="vm-values">
            <p className="eyebrow"><i /> OUR CORE VALUES</p>
            <div className="values-grid">
              {values.map(v => (
                <article className="value-card" key={v.title}>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eight pillars */}
      <section className="section manifesto-pillars">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> THE FULL AGENDA</p>
              <h2>Eight pillars<br /><em>of transformation.</em></h2>
            </div>
            <p>Anchoring the Vijana na Tender and Soko Bila Rent ideas above is a complete plan spanning infrastructure, farming, housing, health, education, water, tourism, and governance.</p>
          </div>

          <div className="pillars-grid">
            {pillars.map(pillar => (
              <article className="pillar-card" key={pillar.number}>
                <header>
                  <span className="pillar-number">{pillar.number}</span>
                  <h3>{pillar.title}</h3>
                </header>
                <div className="pillar-section">
                  <span className="pillar-eyebrow">My government will</span>
                  <ul>
                    {pillar.will.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="pillar-section pillar-outcomes">
                  <span className="pillar-eyebrow">Expected outcomes</span>
                  <ul>
                    {pillar.outcomes.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* First-term targets */}
      <section className="section manifesto-targets">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><i /> OUR FIRST TERM</p>
              <h2>Targets, 2027–2032.<br /><em>What success looks like in five years.</em></h2>
            </div>
          </div>
          <div className="targets-grid">
            <div className="target-item"><strong>1,500 km</strong><span>of roads upgraded and maintained</span></div>
            <div className="target-item"><strong>90%</strong><span>household access to clean water</span></div>
            <div className="target-item"><strong>20M</strong><span>trees planted</span></div>
            <div className="target-item"><strong>1,000,000</strong><span>jobs created across agriculture, industry, tourism and enterprise</span></div>
            <div className="target-item"><strong>11/11</strong><span>sub-counties with affordable housing and modern bus parks</span></div>
            <div className="target-item"><strong>100%</strong><span>of county services fully digitised</span></div>
            <div className="target-item"><strong>568+</strong><span>tenders a term now carrying a Vijana na Tender internship guarantee</span></div>
            <div className="target-item"><strong>11</strong><span>sub-counties hosting regular Soko Bila Rent market days</span></div>
            <div className="target-item"><strong>0</strong><span>tolerance for corruption and wastage</span></div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="section manifesto-conclusion">
        <div className="container manifesto-conclusion-inner">
          <p className="eyebrow"><i /> CONCLUSION</p>
          <h2>The time for a new Nakuru<br /><em>is now.</em></h2>
          <p>The Nakuru Transformation Agenda is a contract between leadership and the people. Together, we will build a county that creates jobs, supports farmers, empowers youth, protects the environment, attracts investment, and delivers quality services to every resident.</p>
          <p className="manifesto-tag">A County of Opportunity. A County of Integrity. <em>A County That Works for Everyone.</em></p>
          <p className="manifesto-sign"><b>Richard Muriuki</b><small>Candidate for Governor, Nakuru County · “Changing Kenya County by County”</small></p>
        </div>
      </section>

      <ActionBand title="Read it. Share it. Make it real." text="Bring your voice, your skills, and your network — and help build the Nakuru Kwetu we all deserve." />
    </SiteShell>
  )
}
