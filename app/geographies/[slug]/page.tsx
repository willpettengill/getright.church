import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getGeography, getPoliticians } from '@/lib/api'
import { PoliticianCard } from '@/components/politician-card'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const geography = await getGeography(params.slug)
    return {
      title: `${geography.name} | get-right.church`,
      description: `Politicians and engagement metrics for ${geography.name}`,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

export default async function GeographyPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  let geography
  try {
    geography = await getGeography(params.slug)
  } catch {
    notFound()
  }

  const politicians = await getPoliticians(geography.id, 50)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <Link href="/geographies" className="text-accent-primary hover:text-accent-light font-mono text-sm mb-4 inline-block">
              ← Back to Geography
            </Link>
            <h1 className="text-5xl font-bold mb-2 text-text-primary">{geography.name}</h1>
            <p className="text-lg text-text-secondary font-mono">
              {geography.type.charAt(0).toUpperCase() + geography.type.slice(1)} Level
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold font-mono mb-6 text-text-primary">
              Politicians in {geography.name}
            </h2>

            {politicians.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {politicians.map((politician) => (
                  <PoliticianCard key={politician.id} politician={politician} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-tertiary font-mono">
                  No politicians found for this region
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
