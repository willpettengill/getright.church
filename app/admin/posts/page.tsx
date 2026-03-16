import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin: Posts | get-right.church',
}

export default async function AdminPostsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('id, content_text, source_platform, approved, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold font-mono text-text-primary mb-8">Review Posts</h1>

          <div className="space-y-4">
            {posts?.map((post) => (
              <div key={post.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-text-primary mb-2 line-clamp-2">{post.content_text}</p>
                    <p className="text-xs text-text-secondary font-mono">
                      {post.source_platform} • {post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-mono whitespace-nowrap ml-4 ${
                      post.approved
                        ? 'bg-status-positive/10 text-status-positive'
                        : 'bg-status-negative/10 text-status-negative'
                    }`}
                  >
                    {post.approved ? '✓ Approved' : '○ Pending'}
                  </span>
                </div>
                <div className="flex gap-3">
                  {!post.approved && (
                    <button className="text-xs text-status-positive hover:text-status-positive/80 font-mono">
                      Approve
                    </button>
                  )}
                  <button className="text-xs text-status-negative hover:text-status-negative/80 font-mono">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
