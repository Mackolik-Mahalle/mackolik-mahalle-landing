// Wordmark and glyphs lifted from the Android app's vector drawables
// (ic_mackolik_logo.xml, ic_arrow_back.xml, ic_share.xml, ic_play.xml).

export function MackolikLogo({ className, title = 'mackolik' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 110 20" className={className} role="img" aria-label={title} fill="currentColor">
      <path d="M14.18 4.99c4.04 0 5.82 1.54 5.82 5.5V20h-3.72v-9c0-2.16-.43-2.7-2.39-2.7h-2.07V20H8.05V8.29H3.72V20H0V4.99h14.18Z" />
      <path fillRule="evenodd" d="M30.21 5.51c1.85 0 3.6.87 4.39 2.23l.1-1.9h3.27v13.72h-3.21l-.17-2c-.78 1.61-2.93 2.39-4.47 2.42-4.08.03-7.1-2.48-7.1-7.29 0-4.73 3.16-7.2 7.19-7.18Zm-3.77 7.18c0 2.62 1.81 4.18 4.08 4.18 5.36 0 5.36-8.32 0-8.32-2.26 0-4.08 1.53-4.08 4.14Z" />
      <path d="M47.67 16.73c-2.12 0-3.91-1.39-3.91-4.01 0-2.39 1.68-4.06 3.97-4.06.95 0 1.95.36 2.76 1.09l2.15-2.26c-1.51-1.47-3.02-2.03-4.97-2.03-4 0-7.32 2.4-7.32 7.26 0 4.87 3.32 7.26 7.32 7.26 2.04 0 3.71-.61 5.31-2.17l-2.29-2.23c-.83.84-1.92 1.14-3.01 1.14Z" />
      <path d="M66.53 6.04v-.19h-4.08l-4.64 5.51V.12h-3.41v19.45h3.41v-6.2l5.39 6.2h4.11v-.25l-6.4-7.01 5.62-6.26Z" />
      <path fillRule="evenodd" d="M67.64 12.72c0-3.92 2.74-7.15 7.13-7.15 4.39 0 7.21 3.23 7.21 7.15 0 3.95-2.71 7.15-7.18 7.15-4.47 0-7.16-3.2-7.16-7.15Zm3.41 0c0 2.09 1.26 4.04 3.75 4.04 2.49 0 3.75-1.95 3.75-4.03 0-2.06-1.46-4.06-3.75-4.06-2.46 0-3.75 2-3.75 4.06Z" />
      <path d="M84.32.12h3.39v19.45h-3.39zM90.69 5.79h3.41v13.77h-3.41zM90.39 1.98c0 2.64 4.02 2.64 4.02 0 0-2.64-4.02-2.64-4.02 0ZM103.6 12.3l5.62-6.26v-.19h-4.08l-4.64 5.51V.12h-3.41v19.45h3.41v-6.2l5.39 6.2H110v-.25l-6.4-7.01Z" />
    </svg>
  )
}

export function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 4 7 12l8 8" />
    </svg>
  )
}

export function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
    </svg>
  )
}

export function PlayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  )
}
