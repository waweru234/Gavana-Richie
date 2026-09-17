'use client'

import { useEffect, useRef, useState } from 'react'

export function AboutVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [needsUnmute, setNeedsUnmute] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    v.muted = true
    const tryAutoplayWithSound = async () => {
      try {
        await v.play()
        try {
          v.muted = false
          v.volume = 0.25
          setNeedsUnmute(false)
        } catch {
          setNeedsUnmute(true)
        }
      } catch {
        setNeedsUnmute(true)
      }
    }
    tryAutoplayWithSound()

    const onEnded = () => { v.currentTime = 0 }
    v.addEventListener('ended', onEnded)

    return () => {
      v.removeEventListener('ended', onEnded)
    }
  }, [])

  const enableSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 0.25
    setNeedsUnmute(false)
  }

  return (
    <div className="about-video-frame">
      {!failed ? (
        <video
          ref={videoRef}
          className="about-video"
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="about-video-fallback">
          <p>Video could not be loaded. <a href={src} target="_blank" rel="noreferrer">Open the video in a new tab</a>.</p>
        </div>
      )}
      {needsUnmute && !failed && (
        <button type="button" className="about-video-unmute" onClick={enableSound} aria-label="Enable sound">
          <span className="about-video-unmute-icon" aria-hidden>♪</span>
          Tap to enable sound
        </button>
      )}
    </div>
  )
}
