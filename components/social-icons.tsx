export type SocialLink = {
  href: string
  label: string
  kind: 'instagram' | 'facebook' | 'tiktok' | 'email'
}

export const socialLinks: SocialLink[] = [
  { href: 'https://www.instagram.com/gavanarichie?stkn=MmM2bXVxNzJ5cXJo', label: 'Instagram', kind: 'instagram' },
  { href: 'https://www.facebook.com/share/19cytJWheC/', label: 'Facebook', kind: 'facebook' },
  { href: 'https://www.tiktok.com/@gavanarichard?_r=1&_t=ZS-99nmsGZOssr', label: 'TikTok', kind: 'tiktok' },
  { href: 'mailto:richardgithatu@gavanarichie.com', label: 'richardgithatu@gavanarichie.com', kind: 'email' },
]

export function SocialIcon({ kind, size = 18 }: { kind: SocialLink['kind']; size?: number }) {
  const attrs = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true } as const
  if (kind === 'instagram') {
    return (
      <svg {...attrs}>
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.25 2.43.41.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.16.46.36 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.97-.41 2.43-.24.61-.52 1.05-.98 1.51-.46.46-.9.74-1.51.98-.46.16-1.26.36-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.25-2.43-.41a4.07 4.07 0 0 1-1.51-.98 4.07 4.07 0 0 1-.98-1.51c-.16-.46-.36-1.26-.41-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.97.41-2.43.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.46-.16 1.26-.36 2.43-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.14 0-3.51.01-4.76.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.83-.39.39-.63.76-.83 1.27-.15.39-.33.97-.38 2.04-.06 1.25-.07 1.62-.07 4.76s.01 3.51.07 4.76c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.27.39.39.76.63 1.27.83.39.15.97.33 2.04.38 1.25.06 1.62.07 4.76.07s3.51-.01 4.76-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.83.39-.39.63-.76.83-1.27.15-.39.33-.97.38-2.04.06-1.25.07-1.62.07-4.76s-.01-3.51-.07-4.76c-.05-1.07-.23-1.65-.38-2.04-.2-.51-.44-.88-.83-1.27a3.4 3.4 0 0 0-1.27-.83c-.39-.15-.97-.33-2.04-.38C15.51 3.79 15.14 3.78 12 3.78Zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92Zm0 1.62a3.84 3.84 0 1 0 0 7.68 3.84 3.84 0 0 0 0-7.68Zm5.7-2.92a1.28 1.28 0 1 1 0 2.56 1.28 1.28 0 0 1 0-2.56Z" />
      </svg>
    )
  }
  if (kind === 'facebook') {
    return (
      <svg {...attrs}>
        <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.93Z" />
      </svg>
    )
  }
  if (kind === 'tiktok') {
    return (
      <svg {...attrs}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1.05-.08A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31Z" />
      </svg>
    )
  }
  if (kind === 'email') {
    return (
      <svg {...attrs}>
        <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.46-.5 6.54 6.45 6.54-6.45H5.46Zm15.04 1-7.07 6.97a1 1 0 0 1-1.39 0L4.5 6V18.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V6Z" />
      </svg>
    )
  }
  return (
    <svg {...attrs}>
      <path d="M6.62 10.79a14.21 14.21 0 0 0 6.38 6.38l2.13-2.13a1 1 0 0 1 1.05-.24 11.65 11.65 0 0 0 3.65.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.62a1 1 0 0 1 1 1 11.65 11.65 0 0 0 .58 3.65 1 1 0 0 1-.24 1.05l-2.34 2.09Z" />
    </svg>
  )
}

export function SocialIcons({ variant = 'navy', size = 'md' }: { variant?: 'navy' | 'light' | 'gold'; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 16, md: 18, lg: 22 } as const
  const ic = sizeMap[size]
  return (
    <ul className={`social-icons social-icons-${variant} social-icons-${size}`}>
      {socialLinks.map(l => (
        <li key={l.kind}>
          <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noreferrer' : undefined} aria-label={l.label}>
            <SocialIcon kind={l.kind} size={ic} />
          </a>
        </li>
      ))}
    </ul>
  )
}
