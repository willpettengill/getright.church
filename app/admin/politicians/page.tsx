import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin: Politicians | get-right.church',
}

export default async function AdminPoliticiansPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: politicians } = await supabase
    .from('politicians')
    .select('id, name, slug, endorsement_status')
    .limit(20)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-mono text-text-primary">Manage Politicians</h1>
            <button className="px-4 py-2 bg-accent-primary text-white font-mono font-bold rounded hover:bg-accent-dark">
              + Add Politician
            </button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-muted">
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">Name</th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">Slug</th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">Status</th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {politicians?.map((politician) => (
                  <tr key={politician.id} className="border-b border-neutral-muted hover:bg-bg-tertiary">
                    <td className="py-3 px-4 text-text-primary">{politician.name}</td>
                    <td className="py-3 px-4 text-text-secondary font-mono">{politician.slug}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          politician.endorsement_status === 'endorsed'
                            ? 'bg-status-positive/10 text-status-positive'
                            : politician.endorsement_status === 'anti-endorsed'
                              ? 'bg-status-negative/10 text-status-negative'
                              : 'bg-neutral-muted text-text-secondary'
                        }`}
                      >
                        {politician.endorsement_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-accent-primary hover:text-accent-light text-xs font-mono">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
