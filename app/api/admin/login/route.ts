import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  checkPassword,
  createSessionToken,
  isAdminConfigured,
} from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin login is not set up. Add ADMIN_PASSWORD to your environment variables.' },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => ({}))
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!(await checkPassword(password))) {
    // Small delay to slow down guessing
    await new Promise(r => setTimeout(r, 600))
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return res
}
