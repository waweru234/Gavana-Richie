'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/analytics-client'

export function AnalyticsTracker() {
  const pathname = usePathname()
  const firstView = useRef(true)

  useEffect(() => {
    if (!pathname) return
    // Only the landing page view carries the external referrer
    const referrer = firstView.current ? document.referrer : ''
    firstView.current = false
    track('pageview', { path: pathname, referrer })
  }, [pathname])

  return null
}
