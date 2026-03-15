import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-display' })

export const metadata: Metadata = {
  title: 'get-right.church | Political Engagement Platform',
  description: 'Real-time political sentiment, endorsements, and voter engagement for the 2024 election cycle.',
  keywords: 'politics, election, endorsement, voter engagement, sentiment analysis',
  authors: [{ name: 'get-right.church' }],
  openGraph: {
    title: 'get-right.church',
    description: 'Real-time political engagement and sentiment analysis.',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${bebasNeue.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
