import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

// Display face — the artwork. Variable axis 200–700.
const clash = localFont({
  src: './fonts/ClashDisplay-Variable.woff2',
  weight: '200 700',
  display: 'swap',
  variable: '--font-clash',
})

// Working face — UI, labels, body, numerics.
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-grotesk',
})

export const metadata: Metadata = {
  title: 'Solar Estimator — Ashwitha Energy Services',
  description:
    'An interactive solar experience. Find out what your roof can save over 25 years.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${clash.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
