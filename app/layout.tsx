import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

// Roboto is the only family in the Mackolik Figma file (Regular → Black Italic).
const roboto = Roboto({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3200'),
  title: 'Mahalle · Halı saha maçların Mackolik’te',
  description:
    'Mahalle, halı saha maçlarını skoru, kadrosu ve gol videolarıyla Mackolik’e taşır. Halı saha işletmeleri tesislerini buradan Mahalle’ye ekleyebilir.',
  openGraph: {
    title: 'Mahalle · Halı saha maçların Mackolik’te',
    description: 'Halı sahanı Mahalle’ye ekle; maçlar, kadrolar ve gol videoları Mackolik’te.',
    images: ['/media/hero-poster.jpg'],
    locale: 'tr_TR',
    type: 'website',
  },
  icons: { icon: '/media/mahalle-logo.png' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3866b0' },
    { media: '(prefers-color-scheme: dark)', color: '#23292e' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
