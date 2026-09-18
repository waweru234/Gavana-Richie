'use client'

import { useEffect, useRef, useState } from 'react'

export function AboutVideo({ src, poster }: { src: string; poster?: string }) {
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
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="about-video-fallback about-video-fallback-image">
          <img src={poster || '/richie-main.png'} alt="Richie Githatu — still from the campaign documentary" />
          <div className="about-video-fallback-inner">
            <p className="about-video-fallback-tag">A short documentary edit</p>
            <a className="about-video-fallback-open" href={src} target="_blank" rel="noreferrer">
              <span className="about-video-fallback-play" aria-hidden>▶</span>
              Open the video in a new tab
            </a>
            <p className="about-video-fallback-note">Your browser can&apos;t play this file inline. Tap above to open it directly.</p>
          </div>
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
