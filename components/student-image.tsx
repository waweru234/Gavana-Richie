'use client'

import { useState } from 'react'

interface StudentImageProps {
  src: string | null
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

export function StudentImage({ src, alt, className, loading }: StudentImageProps) {
  const [failed, setFailed] = useState(false)
  // This file exists in /public. Keep the fallback local so a failed remote image
  // does not create a second 404 and hide the original error.
  const fallback = '/placeholder.jpg'
  const handleError = () => {
    if (!failed) {
      console.error('Student image failed to load', {
        src,
        alt,
        reason: src ? 'The remote URL returned an invalid/unavailable image' : 'No image URL was saved for this student',
      })
      setFailed(true)
    }
  }

  return (
    <>
      <img
        src={!failed && src ? src : fallback}
        alt={alt}
        className={className}
        loading={loading}
        onError={handleError}
      />
      {failed && (
        <small className="student-image-error" role="status">
          {src ? 'Image link failed — it may be private, expired, or unavailable.' : 'No image link was saved for this student.'}
        </small>
      )}
    </>
  )
}
