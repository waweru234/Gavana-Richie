import { getSupabaseServerClient } from '@/lib/supabase'
import { getContent } from '@/lib/site-content'

export const CHATBOT_SETTINGS_KEY = 'chatbot'

export interface ChatbotSettings {
  greeting: string
  quickQuestions: string[]
  instructions: string
  fallback: string
}

export const DEFAULT_CHATBOT_SETTINGS: ChatbotSettings = {
  greeting:
    "Hi, I'm Richie Githatu's campaign assistant for the 2027 Governor race in Nakuru County. I can help with payments, the agenda, ADOPT-A-STUDENT, Vijana na Tender, Soko Bila Rent, and how to join the movement. What would you like to know?",
  quickQuestions: ['How do I pay M-Pesa?', 'What is Vijana na Tender?', 'How can I adopt a student?'],
  instructions: '',
  fallback: '',
}

export interface KnowledgeEntry {
  id: string
  question: string
  answer: string
  keywords: string[]
}

export function getChatbotSettings(): Promise<ChatbotSettings> {
  return getContent(CHATBOT_SETTINGS_KEY, DEFAULT_CHATBOT_SETTINGS)
}

export async function getActiveKnowledge(): Promise<KnowledgeEntry[]> {
  const supabase = getSupabaseServerClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('chatbot_knowledge')
    .select('id, question, answer, keywords')
    .eq('active', true)
    .order('updated_at', { ascending: false })
    .limit(200)
  if (error || !data) return []
  return data
}

export function cleanKeywords(value: unknown): string[] {
  const list = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  return list
    .map(k => String(k).trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 20)
}

const STOPWORDS = new Set(
  'a an the is are was were be to of in on for and or but with at by from how what when where who why which do does did can could i you we me my your our it this that there please tell about am will would should'.split(' ')
)

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t))
}

// Returns the trained answer that confidently matches the visitor's question, if any.
export function findKnowledgeMatch(question: string, entries: KnowledgeEntry[]): KnowledgeEntry | null {
  const q = question.toLowerCase()
  const qTokens = new Set(tokens(question))
  let best: { entry: KnowledgeEntry; score: number } | null = null

  for (const entry of entries) {
    const keywordHits = entry.keywords.filter(k => k.trim() && q.includes(k.trim().toLowerCase())).length
    const entryTokens = Array.from(new Set(tokens(entry.question)))
    const overlap = entryTokens.length
      ? entryTokens.filter(t => qTokens.has(t)).length / entryTokens.length
      : 0

    const confident = keywordHits >= 2 || overlap >= 0.7 || (keywordHits >= 1 && overlap >= 0.34)
    if (!confident) continue
    const score = keywordHits + overlap * 2
    if (!best || score > best.score) best = { entry, score }
  }
  return best?.entry ?? null
}

export function knowledgeAsPrompt(entries: KnowledgeEntry[]): string {
  if (!entries.length) return ''
  const lines = entries
    .slice(0, 60)
    .map(e => `Q: ${e.question}\nA: ${e.answer}`)
    .join('\n\n')
  return `\n\nApproved campaign answers. When a question matches one of these, answer using this information:\n\n${lines}`
}

export function deviceFromUserAgent(ua: string | null): string {
  if (!ua) return 'unknown'
  if (/ipad|tablet/i.test(ua)) return 'tablet'
  if (/mobi|android|iphone/i.test(ua)) return 'mobile'
  return 'desktop'
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Stores one question/answer exchange. Logging must never break the chat, so errors are swallowed.
export async function logChatExchange(input: {
  conversationId: unknown
  visitorId: unknown
  path: unknown
  userAgent: string | null
  userText: string
  replyText: string
  source: 'knowledge' | 'gemini' | 'rules'
}) {
  const supabase = getSupabaseServerClient()
  const id = typeof input.conversationId === 'string' ? input.conversationId : ''
  if (!supabase || !UUID_RE.test(id)) return
  try {
    const now = new Date().toISOString()
    const { data: existing } = await supabase
      .from('chat_conversations')
      .select('message_count')
      .eq('id', id)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('chat_conversations')
        .update({ message_count: existing.message_count + 2, last_message_at: now })
        .eq('id', id)
    } else {
      await supabase.from('chat_conversations').insert({
        id,
        visitor_id: typeof input.visitorId === 'string' ? input.visitorId.slice(0, 64) : null,
        path: typeof input.path === 'string' ? input.path.slice(0, 300) : null,
        device: deviceFromUserAgent(input.userAgent),
        first_message: input.userText.slice(0, 500),
        message_count: 2,
        created_at: now,
        last_message_at: now,
      })
    }

    await supabase.from('chat_messages').insert([
      { conversation_id: id, role: 'user', text: input.userText.slice(0, 4000), created_at: now },
      {
        conversation_id: id,
        role: 'model',
        text: input.replyText.slice(0, 8000),
        source: input.source,
        created_at: new Date(Date.now() + 1).toISOString(),
      },
    ])
  } catch (error) {
    console.error('Failed to log chat exchange:', error)
  }
}
