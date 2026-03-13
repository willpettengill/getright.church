import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PoliticianCard } from '@/components/politician-card'
import { getPoliticians } from '@/lib/api'
import Link from 'next/link'

export const metadata = {
  title: 'Politicians | get-right.church',
  description: 'Browse all tracked politicians and their endorsement status',
}

export default async function PoliticiansPage() {
  const politicians = await getPoliticians(undefined, 100)

  const endorsed = politicians.filter((p) => p.endorsement_status === 'endorsed')
  const opposed = politicians.filter((p) => p.endorsement_status === 'anti-endorsed')
  const watching = politicians.filter((p) => p.endorsement_status === 'watching')

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-text-primary">
              Politicians
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Track politicians by their endorsement status and aggregate community sentiment.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-4 mb-12 border-b border-neutral-muted pb-4">
            <button className="font-mono text-accent-primary border-b-2 border-accent-primary pb-2">
              All ({politicians.length})
            </button>
            <button className="font-mono text-text-secondary hover:text-accent-primary pb-2">
              Endorsed ({endorsed.length})
            </button>
            <button className="font-mono text-text-secondary hover:text-accent-primary pb-2">
              Opposed ({opposed.length})
            </button>
            <button className="font-mono text-text-secondary hover:text-accent-primary pb-2">
              Watching ({watching.length})
            </button>
          </div>

          {/* Politicians grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {politicians.map((politician) => (
              <PoliticianCard key={politician.id} politician={politician} />
            ))}
          </div>

          {politicians.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-tertiary font-mono mb-4">No politicians found</p>
              <Link href="/" className="text-accent-primary hover:text-accent-light">
                Return to home
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
