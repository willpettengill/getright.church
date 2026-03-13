import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getGeographies } from '@/lib/api'
import Link from 'next/link'

export const metadata = {
  title: 'Geography | get-right.church',
  description: 'Explore politicians by geographic region',
}

export default async function GeographiesPage() {
  const geographies = await getGeographies()

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-text-primary">
              Geography
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Explore politicians by their geographic regions and constituency.
            </p>
          </div>

          {geographies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {geographies.map((geo) => (
                <Link key={geo.id} href={`/geographies/${geo.slug}`}>
                  <div className="card hover:border-accent-primary transition-colors cursor-pointer">
                    <h3 className="text-xl font-bold mb-2 text-text-primary">{geo.name}</h3>
                    <p className="text-sm text-text-secondary font-mono mb-3">
                      {geo.type.charAt(0).toUpperCase() + geo.type.slice(1)} Level
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Browse politicians and sentiment in this region
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-tertiary font-mono">No regions available yet</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
