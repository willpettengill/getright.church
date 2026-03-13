import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PulseFeed } from '@/components/pulse-feed'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-mono mb-4 text-accent-primary">
              Get Right
            </h1>
            <p className="text-xl text-text-secondary font-mono mb-8 max-w-2xl">
              Real-time political sentiment, voter engagement, and endorsement tracking for the movement.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/politicians"
                className="button-primary font-mono"
              >
                Browse Politicians
              </Link>
              <Link
                href="/geographies"
                className="button-secondary font-mono"
              >
                Explore by Region
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 p-6 bg-bg-secondary border border-neutral-muted rounded">
            <div>
              <p className="text-sm font-mono text-text-secondary mb-2">Total Politicians Tracked</p>
              <p className="text-3xl font-bold text-accent-primary">1,247</p>
            </div>
            <div>
              <p className="text-sm font-mono text-text-secondary mb-2">Active Posts Analyzed</p>
              <p className="text-3xl font-bold text-accent-primary">45,892</p>
            </div>
            <div>
              <p className="text-sm font-mono text-text-secondary mb-2">Community Members</p>
              <p className="text-3xl font-bold text-accent-primary">3,421</p>
            </div>
            <div>
              <p className="text-sm font-mono text-text-secondary mb-2">Endorsements Made</p>
              <p className="text-3xl font-bold text-accent-primary">892</p>
            </div>
          </div>

          {/* Pulse Feed Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-mono mb-8 text-text-primary">
              The Pulse: Real-Time Sentiment
            </h2>
            <PulseFeed />
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-accent-dark to-accent-primary/20 border border-accent-primary rounded p-12 text-center">
            <h3 className="text-2xl font-bold font-mono mb-4">Join the Movement</h3>
            <p className="text-text-secondary mb-6 max-w-xl mx-auto">
              Engage with politicians, track sentiment, and build a community focused on real change.
            </p>
            <Link
              href="/auth/sign-up"
              className="inline-block px-6 py-3 bg-accent-primary text-white font-mono font-bold rounded hover:bg-accent-dark transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
