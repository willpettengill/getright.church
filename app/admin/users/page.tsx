import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin: Users | get-right.church',
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: users } = await supabase
    .from('users')
    .select('id, username, role, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold font-mono text-text-primary mb-8">Manage Users</h1>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-muted">
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Joined
                  </th>
                  <th className="text-left py-3 px-4 font-mono font-bold text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id} className="border-b border-neutral-muted hover:bg-bg-tertiary">
                    <td className="py-3 px-4 text-text-primary font-mono">{u.username}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          u.role === 'admin'
                            ? 'bg-accent-primary/10 text-accent-primary'
                            : 'bg-neutral-muted text-text-secondary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary text-xs">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : ''}
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
