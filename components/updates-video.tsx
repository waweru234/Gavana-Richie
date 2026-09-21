'use client'

import { useEffect, useRef, useState } from 'react'

interface UpdatesVideoProps {
  src: string
  poster?: string
  caption?: string
  fallbackSrc?: string
}

export function UpdatesVideo({ src, poster, caption, fallbackSrc }: UpdatesVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!isMountedRef.current) return
          if (entry.isIntersecting) {
            attemptAutoplay(video)
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.5, rootMargin: '0px' }
    )

    observer.observe(video)
    return () => {
      isMountedRef.current = false
      observer.disconnect()
    }
  }, [])

  const attemptAutoplay = (video: HTMLVideoElement) => {
    video.muted = true
    const playPromise = video.play() as Promise<void> | undefined
    if (playPromise) {
      playPromise
        .then(() => {
          if (isMountedRef.current) {
            try {
              video.muted = false
              video.volume = 0.5
            } catch {}
          }
        })
        .catch(() => {
          if (isMountedRef.current) {
            video.muted = true
            video.volume = 0
          }
        })
    }
  }

  const handleError = () => {
    if (fallbackSrc && !useFallback) {
      setUseFallback(true)
    } else {
      setFailed(true)
    }
  }

  const handleStalled = (video: HTMLVideoElement) => {
    if (video.readyState < 2) {
      if (fallbackSrc && !useFallback) {
        setUseFallback(true)
      } else {
        setFailed(true)
      }
    }
  }

  const currentSrc = useFallback ? fallbackSrc : src

  return (
    <div className="updates-video-frame-wrapper">
      <span className="updates-video-frame-corner tl" aria-hidden />
      <span className="updates-video-frame-corner tr" aria-hidden />
      <span className="updates-video-frame-corner bl" aria-hidden />
      <span className="updates-video-frame-corner br" aria-hidden />
      <div className="updates-video-frame">
        {!failed ? (
          <video
            ref={videoRef}
            className="updates-video"
            src={currentSrc}
            poster={poster}
            playsInline
            preload="metadata"
            loop
          />
        ) : (
          <div className="updates-video-fallback updates-video-fallback-image">
            <img src={poster || '/richie-main.png'} alt="Video unavailable" />
            <div className="updates-video-fallback-inner">
              <p className="updates-video-fallback-tag">Video unavailable</p>
              <a className="updates-video-fallback-open" href={src} target="_blank" rel="noreferrer">
                <span className="updates-video-fallback-play" aria-hidden>▶</span>
                Open the video in a new tab
              </a>
              <p className="updates-video-fallback-note">Your browser can&apos;t play this file inline. Tap above to open it directly.</p>
            </div>
          </div>
        )}
        {caption && <span className="updates-video-caption">{caption}</span>}
      </div>
    </div>
  )
}