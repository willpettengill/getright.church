import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'The Talk | get-right.church',
  description: 'Community discussion and commentary on politics',
}

export default function TheTalkPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-text-primary">
              The Talk
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Engage in community discussion about politics, endorsements, and the issues that matter.
            </p>
          </div>

          <div className="card text-center py-16">
            <p className="text-text-tertiary font-mono mb-4">Coming Soon</p>
            <p className="text-lg text-text-secondary">
              The Talk discussion forum is being built. Check back soon to engage with the community.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
