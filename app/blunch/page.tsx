import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Blunch | get-right.church',
  description: 'Community events and networking',
}

export default function BlunchPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-text-primary">
              Blunch
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Connect with fellow believers and organizers at community events.
            </p>
          </div>

          <div className="card text-center py-16">
            <p className="text-text-tertiary font-mono mb-4">Coming Soon</p>
            <p className="text-lg text-text-secondary">
              Blunch events are coming soon. This is where the community gathers in person.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
