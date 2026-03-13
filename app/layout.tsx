import type { Metadata, Viewport } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
