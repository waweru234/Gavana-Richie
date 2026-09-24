import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type Incoming = { role: 'user' | 'model'; text: string }

const CAMPAIGN = {
  candidate: 'Richie Githatu',
  race: 'Governor of Nakuru County, 2027',
  slogan: 'Nakuru Kwetu · New Generation',
  phone: '0716 774 555',
  phoneAlt: '0738 972 179',
  whatsapp: 'https://wa.me/254738972179',
  email: 'richardgithatu@gavanarichie.com',
  paybill: '600100',
  account: '320032',
  smallest: 'KSh 10',
  joinLink: '/join',
  donateLink: '/donate',
  studentsLink: '/students',
  studentsCount: 4,
  pillars: 8,
  internStats: '2,840 internships a term · 568 contracts',
}

const MONEY_GUARD =
  "Pay directly using the M-Pesa details shown on the relevant page, then send us a note via the Join form so we can credit you."

function replyFor(input: string): string {
  const q = input.toLowerCase().trim()
  if (!q) return 'Please type a question to begin.'

  if (/(hello|hi|hey|good (morning|afternoon|evening)|habari|jambo|sasa)/.test(q)) {
    return `Hello! I'm Richie's campaign assistant for the 2027 Governor race here in Nakuru. I can help with M-Pesa payments, ADOPT-A-STUDENT, Vijana na Tender, Soko Bila Rent, and how to join the movement. What would you like to know?`
  }

  if (/(who|about).*(richie|candidate|governor|you)/.test(q) || /about richie/.test(q)) {
    return `Richie Githatu is running for ${CAMPAIGN.race} under the slogan "${CAMPAIGN.slogan}". The campaign is people-powered — built door by door across all 11 sub-counties. Read the full story on the About page.`
  }

  if (/(m-?pesa|m pesa|paybill|how.*pay|pay.*how|donate|payment|support.*money|give.*money)/.test(q)) {
    return `Support the campaign via M-Pesa:\n\n• Paybill: ${CAMPAIGN.paybill}\n• Account number: ${CAMPAIGN.account}\n• Smallest contribution: ${CAMPAIGN.smallest}\n\n${MONEY_GUARD}\n\nConfirmation SMS reaches you instantly. Send us a note on the Join form so we can credit your contribution and share the accountability report.`
  }

  if (/(adopt|student|school|pay.*fees|sponsor)/.test(q)) {
    return `ADOPT-A-STUDENT is a direct-pay programme. Today, ${CAMPAIGN.studentsCount} bright Nakuru students are waiting. Pick a profile, pay the school directly using the Paybill + Account shown on their page — any amount helps. ${MONEY_GUARD}`
  }

  if (/(vijana|tender|youth|intern)/.test(q)) {
    return `Vijana na Tender is Pillar 1 of the agenda: every county tender above KSh 5M takes on 5 youth interns for 6 months, paid by the county. Pillar 1 alone unlocks ${CAMPAIGN.internStats}. Read the full policy in the manifesto.`
  }

  if (/(soko|market|rent|mama|boda)/.test(q)) {
    return `Soko Bila Rent is Pillar 2 of the agenda: regular rent-free market days in every ward across all 11 sub-counties, so traders and small producers can reach first customers without paying shop rent. Full policy is in the manifesto under Pillar 2.`
  }

  if (/(procurement|scorecard|accountab|corrupt|pillar|pillar 8)/.test(q)) {
    return `Pillar 8 of the manifesto is the Procurement Scorecard: publish every award, public interns tracking each contract, performance contracts by department, and zero tolerance for wastage. Read it in the manifesto.`
  }

  if (/(join|volunteer|sign up|register|movement|take part)/.test(q)) {
    return `Joining the movement is free and takes a minute. Open the Join page, tell us your name, a phone we can reach, and the constituency you call home. The local coordinator for your area will WhatsApp you within 24 hours. You can also call ${CAMPAIGN.phone} or WhatsApp the campaign directly.`
  }

  if (/(agenda|manifesto|pillar|policy|ideas|platform)/.test(q)) {
    return `The agenda has ${CAMPAIGN.pillars} pillars of transformation, anchored by two flagship programmes — Vijana na Tender and ADOPT-A-STUDENT — and Soko Bila Rent for traders. Read the full manifesto on the Agenda page.`
  }

  if (/(phone|call|contact|reach|email|whatsapp)/.test(q)) {
    return `Reach the campaign directly:\n\n• Phone: ${CAMPAIGN.phone}\n• Phone (alt): ${CAMPAIGN.phoneAlt}\n• WhatsApp: ${CAMPAIGN.whatsapp}\n• Email: ${CAMPAIGN.email}\n\nFor movement matters use the Join form so the local coordinator picks it up.`
  }

  if (/(update|news|sunday|latest)/.test(q)) {
    return `The latest campaign updates — Sunday words, event notes, student milestones — are posted on the Updates page. Newest first; one Sunday word shared with the supporter list before it goes public.`
  }

  if (/(vote|register|2027|election)/.test(q)) {
    return `Register as a voter and your voice becomes your power in 2027. The campaign has a registration helper with three steps on the home page. Registration is free, and your participation shapes Nakuru County's future.`
  }

  if (/(leadersh|new generation|why richie|why you|why him)/.test(q)) {
    return `Richie Githatu brings a new-generation spirit to public service — practical, warm, and focused on turning ideas into opportunity. The slogan is "Nakuru Kwetu · New Generation" because the next chapter of Nakuru is written by people who choose to participate.`
  }

  if (/(thank|asante|thanks|nice|great)/.test(q)) {
    return `Asante! If you can, support the movement with ${CAMPAIGN.smallest} via M-Pesa (Paybill ${CAMPAIGN.paybill} · Account ${CAMPAIGN.account}), and join the movement so we can reach you with the next Sunday word.`
  }

  if (/(bye|goodbye|see you)/.test(q)) {
    return `Karibu sana. Call ${CAMPAIGN.phone} anytime, or support the movement with ${CAMPAIGN.smallest} on M-Pesa.`
  }

  return `I might not have a quick answer for that one. Try asking about M-Pesa payments, ADOPT-A-STUDENT, Vijana na Tender, Soko Bila Rent, the 8-pillar manifesto, or how to join the movement. You can also reach the team directly: ${CAMPAIGN.phone} · ${CAMPAIGN.email}.`
}

async function callGeminiIfAvailable(messages: { role: 'user' | 'model'; parts: { text: string }[] }[]): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) return null
  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash'
  const system =
    `You are Richie Githatu's campaign assistant for the 2027 Governor race in Nakuru County, Kenya. ` +
    `Keep answers short (under 120 words), warm, and practical. Use plain language — avoid jargon. ` +
    `When you suggest an action that involves money, always say: "${MONEY_GUARD}" ` +
    `Speak for the people-powered movement: Vijana na Tender, Soko Bila Rent, ADOPT-A-STUDENT, and 8 pillars of transformation. ` +
    `If a question is outside the campaign, gently redirect to the closest programme page or the campaign contact line.`
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: messages }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts
    if (Array.isArray(parts) && parts.length) {
      const text = parts.map((p: { text?: string }) => p.text ?? '').join('').trim()
      return text || null
    }
    return null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = Array.isArray(body?.messages) ? (body.messages as Incoming[]) : []
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUser || !String(lastUser.text || '').trim()) {
      return NextResponse.json({ text: 'Please type a question to begin.' }, { status: 200 })
    }
    const seedPrev = messages
      .filter(m => m.role === 'user' || m.role === 'model')
      .map(m => ({ role: m.role as 'user' | 'model', parts: [{ text: String(m.text || '') }] }))
    const trimmed = seedPrev.slice(-12)
    const geminiReply = await callGeminiIfAvailable(trimmed)
    if (geminiReply) {
      return NextResponse.json({ text: geminiReply }, { status: 200 })
    }
    const userText = String(lastUser.text || '').trim()
    const local = replyFor(userText)
    return NextResponse.json({ text: local }, { status: 200 })
  } catch {
    return NextResponse.json(
      { text: 'Please type a question to begin.' },
      { status: 200 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Ask Richie campaign assistant endpoint. POST { messages: [{ role, text }] }.',
  })
}
