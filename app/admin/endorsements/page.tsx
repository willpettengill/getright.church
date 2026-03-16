import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin: Endorsements | get-right.church',
}

export default async function AdminEndorsementsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: log } = await supabase
    .from('endorsement_log')
    .select('id, politician_id, previous_status, new_status, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold font-mono text-text-primary mb-8">Endorsements Log</h1>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-muted">
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Politician
                  </th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Previous
                  </th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    New
                  </th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Reason
                  </th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {log?.map((entry) => (
                  <tr key={entry.id} className="border-b border-neutral-muted hover:bg-bg-tertiary">
                    <td className="py-3 px-4 text-text-primary">{entry.politician_id}</td>
                    <td className="py-3 px-4 text-text-secondary text-xs">{entry.previous_status}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 bg-neutral-muted rounded">
                        {entry.new_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs">{entry.reason}</td>
                    <td className="py-3 px-4 text-text-tertiary text-xs font-mono">
                      {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ''}
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
