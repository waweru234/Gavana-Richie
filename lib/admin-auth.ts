// Password-based admin sessions. The cookie holds `<expiry>.<hmac(expiry)>`, signed
// with ADMIN_SESSION_SECRET (or ADMIN_PASSWORD when no separate secret is set).
// Uses Web Crypto only so it runs in both the proxy and route handlers.

export const ADMIN_COOKIE = 'nk_admin'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

const encoder = new TextEncoder()

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_PASSWORD?.trim() || null
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim())
}

async function hmac(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, '0')).join('')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_PASSWORD is not configured')
  const expires = String(Date.now() + SESSION_TTL_SECONDS * 1000)
  return `${expires}.${await hmac(expires, secret)}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret()
  if (!secret || !token) return false
  const [expires, sig] = token.split('.')
  if (!expires || !sig || Number(expires) < Date.now()) return false
  return safeEqual(sig, await hmac(expires, secret))
}

export async function checkPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) return false
  // Compare digests so timing does not leak the password length
  const secret = 'nk-admin-password-check'
  return safeEqual(await hmac(password, secret), await hmac(expected, secret))
}
