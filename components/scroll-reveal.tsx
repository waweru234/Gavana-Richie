'use client'

import { useEffect } from 'react'

export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      const revealAll = () => {
        document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach(el => {
          el.classList.add('is-revealed')
        })
      }
      revealAll()
      const mo = new MutationObserver(revealAll)
      mo.observe(document.body, { childList: true, subtree: true })
      return () => mo.disconnect()
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const observeNew = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach(el => {
        io.observe(el)
      })
    }

    observeNew()

    const mo = new MutationObserver(observeNew)
    mo.observe(document.body, { childList: true, subtree: true })

    const onPageShow = () => observeNew()
    window.addEventListener('pageshow', onPageShow)

    return () => {
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  return null
}
