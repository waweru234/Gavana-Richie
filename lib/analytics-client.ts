'use client'

// Anonymous visitor/session ids for first-party analytics. No personal data is stored.

function randomId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function storedId(storage: () => Storage, key: string): string {
  try {
    const s = storage()
    let id = s.getItem(key)
    if (!id) {
      id = randomId()
      s.setItem(key, id)
    }
    return id
  } catch {
    return randomId()
  }
}

export const getVisitorId = () => storedId(() => window.localStorage, 'nk_vid')
export const getSessionId = () => storedId(() => window.sessionStorage, 'nk_sid')
export const newConversationId = randomId

export function track(type: 'pageview' | 'event', data: { path: string; name?: string; referrer?: string }) {
  if (data.path.startsWith('/admin')) return
  const body = JSON.stringify({
    type,
    ...data,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
  })
  try {
    if (navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) return
  } catch {
    // fall through to fetch
  }
  fetch('/api/track', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
}

export const trackEvent = (name: string) => track('event', { name, path: window.location.pathname })
