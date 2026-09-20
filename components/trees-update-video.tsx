'use client'

import { useEffect, useRef, useState } from 'react'

export function TreesUpdateVideo({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [needsUnmute, setNeedsUnmute] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const supported =
      !!v.canPlayType('video/mp4; codecs="avc1.42E01E,mp4a.40.2"') ||
      !!v.canPlayType('video/mp4') ||
      !!v.canPlayType('video/quicktime')
    if (!supported) {
      setFailed(true)
      return
    }

    v.muted = true
    const tryAutoplayWithSound = async () => {
      try {
        await v.play()
        try {
          v.muted = false
          v.volume = 0.6
          setNeedsUnmute(false)
        } catch {
          setNeedsUnmute(true)
        }
      } catch {
        setNeedsUnmute(true)
      }
    }
    tryAutoplayWithSound()

    const onError = () => setFailed(true)
    const onStalled = () => {
      if (v.readyState < 2) setFailed(true)
    }
    v.addEventListener('error', onError)
    v.addEventListener('stalled', onStalled)
    return () => {
      v.removeEventListener('error', onError)
      v.removeEventListener('stalled', onStalled)
    }
  }, [])

  const enableSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 0.6
    setNeedsUnmute(false)
  }

  return (
    <div className="trees-video-frame">
      {!failed ? (
        <video
          ref={videoRef}
          className="trees-video"
          src={src}
          poster={poster}
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="trees-video-fallback">
          <img src={poster || '/WhatsApp Image 2026-09-20 at 14.37.52.jpeg'} alt="Richie speaking on the state of the trees along a busy Nakuru street" />
          <div className="trees-video-fallback-inner">
            <p className="trees-video-fallback-tag">The Green City &middot; in his own words</p>
            <a className="trees-video-fallback-open" href={src} target="_blank" rel="noreferrer">
              <span className="trees-video-fallback-play" aria-hidden>▶</span>
              Open the video in a new tab
            </a>
            <p className="trees-video-fallback-note">Your browser can&apos;t play this file inline. Tap above to open it directly.</p>
          </div>
        </div>
      )}
      {needsUnmute && !failed && (
        <button type="button" className="trees-video-unmute" onClick={enableSound} aria-label="Enable sound">
          <span className="trees-video-unmute-icon" aria-hidden>♪</span>
          Tap to enable sound
        </button>
      )}
      {caption && <span className="trees-video-caption">{caption}</span>}
    </div>
  )
}
