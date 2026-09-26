import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDirectImageUrl(url: string | null): string | null {
  if (!url) return null
  // Match Google Drive open links: https://drive.google.com/open?id=FILE_ID
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/open\?id=([^&]+)/)
  if (match && match[1]) {
    const fileId = match[1]
    // Return file/d/view link
    return `https://drive.google.com/file/d/${fileId}/view`
  }
  // If not a Google Drive open link, return as-is (could already be a direct link)
  return url
}
