import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Admin Dashboard | get-right.church',
  description: 'Admin tools for moderating and managing politicians',
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userProfile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-accent-primary">
              Admin Dashboard
            </h1>
            <p className="text-lg text-text-secondary">
              Manage politicians, review content, and moderate the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link href="/admin/politicians">
              <div className="card hover:border-accent-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-text-primary mb-2">Politicians</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Add, edit, and manage politician profiles
                </p>
                <p className="text-accent-primary font-mono text-sm">Manage →</p>
              </div>
            </Link>

            <Link href="/admin/posts">
              <div className="card hover:border-accent-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-text-primary mb-2">Posts</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Review and approve posts for the Pulse feed
                </p>
                <p className="text-accent-primary font-mono text-sm">Review →</p>
              </div>
            </Link>

            <Link href="/admin/endorsements">
              <div className="card hover:border-accent-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-text-primary mb-2">Endorsements</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Track and update endorsement statuses
                </p>
                <p className="text-accent-primary font-mono text-sm">View →</p>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="card hover:border-accent-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-text-primary mb-2">Users</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Manage user roles and permissions
                </p>
                <p className="text-accent-primary font-mono text-sm">Manage →</p>
              </div>
            </Link>

            <Link href="/admin/ingest">
              <div className="card hover:border-accent-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-text-primary mb-2">Ingest Data</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Import posts and votes from external sources
                </p>
                <p className="text-accent-primary font-mono text-sm">Ingest →</p>
              </div>
            </Link>

            <Link href="/admin/portraits">
              <div className="card hover:border-accent-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold text-text-primary mb-2">Portraits</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Generate and manage politician AI portraits
                </p>
                <p className="text-accent-primary font-mono text-sm">Generate →</p>
              </div>
            </Link>
          </div>

          <div className="card bg-accent-dark/20 border-accent-dark">
            <h3 className="text-lg font-bold text-accent-primary mb-2">Quick Stats</h3>
            <p className="text-text-secondary text-sm">
              Dashboard stats and analytics coming soon
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
