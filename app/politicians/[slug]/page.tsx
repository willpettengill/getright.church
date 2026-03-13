import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getPolitician, getPosts, getComments, getVotes } from '@/lib/api'
import { PulseFeed } from '@/components/pulse-feed'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  try {
    const politician = await getPolitician(params.slug)
    return {
      title: `${politician.name} | get-right.church`,
      description: politician.bio || `View ${politician.name}'s profile and engagement metrics`,
    }
  } catch {
    return {
      title: 'Not Found',
    }
  }
}

export default async function PoliticianPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  let politician
  try {
    politician = await getPolitician(params.slug)
  } catch {
    notFound()
  }

  const posts = await getPosts(politician.geography_id, politician.id, 10)
  const comments = await getComments(politician.id, 15)
  const votes = await getVotes(politician.id, 10)

  const endorsementClass =
    politician.endorsement_status === 'endorsed'
      ? 'bg-status-positive/10 text-status-positive border-status-positive'
      : politician.endorsement_status === 'anti-endorsed'
        ? 'bg-status-negative/10 text-status-negative border-status-negative'
        : 'bg-neutral-muted text-text-secondary border-neutral-muted'

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero with portrait */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {politician.portrait_url && (
              <div className="md:col-span-1">
                <img
                  src={politician.portrait_url}
                  alt={politician.name}
                  className="w-full rounded border border-neutral-muted"
                />
              </div>
            )}

            <div className={politician.portrait_url ? 'md:col-span-2' : 'md:col-span-3'}>
              <h1 className="text-5xl font-bold mb-2 text-text-primary">{politician.name}</h1>
              <p className="text-xl text-text-secondary font-mono mb-4">{politician.title}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                {politician.party && (
                  <span className="px-3 py-1 bg-neutral-muted text-text-secondary font-mono rounded text-sm">
                    {politician.party}
                  </span>
                )}
                {politician.office_held && (
                  <span className="px-3 py-1 bg-neutral-muted text-text-secondary font-mono rounded text-sm">
                    {politician.office_held}
                  </span>
                )}
                {politician.years_in_office && (
                  <span className="px-3 py-1 bg-neutral-muted text-text-secondary font-mono rounded text-sm">
                    {politician.years_in_office} years
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-text-primary leading-relaxed">{politician.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-bg-secondary border border-neutral-muted rounded">
                  <p className="text-xs font-mono text-text-secondary mb-2">Sentiment Score</p>
                  <p className="text-3xl font-bold text-accent-primary">
                    {politician.aggregate_sentiment.toFixed(2)}
                  </p>
                </div>
                <div className={`p-4 border rounded text-center ${endorsementClass}`}>
                  <p className="text-xs font-mono mb-2">Status</p>
                  <p className="text-xl font-bold">
                    {politician.endorsement_status === 'endorsed'
                      ? '✓ Endorsed'
                      : politician.endorsement_status === 'anti-endorsed'
                        ? '✗ Opposed'
                        : '○ Watching'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-muted mb-12">
            <div className="flex gap-8 font-mono">
              <button className="text-accent-primary border-b-2 border-accent-primary pb-3">
                Pulse Feed
              </button>
              <button className="text-text-secondary hover:text-accent-primary pb-3">
                Votes
              </button>
              <button className="text-text-secondary hover:text-accent-primary pb-3">
                Comments
              </button>
            </div>
          </div>

          {/* Pulse Feed Tab (active) */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6">Recent Posts About This Politician</h2>
            <PulseFeed politicianId={politician.id} />
          </div>

          {/* Votes Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6">Recent Votes</h2>
            {votes.length > 0 ? (
              <div className="space-y-3">
                {votes.map((vote) => (
                  <div key={vote.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-text-primary mb-1">{vote.bill_name}</h4>
                        <p className="text-xs text-text-secondary font-mono">
                          {new Date(vote.vote_date || vote.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-mono font-bold text-lg ${
                            vote.vote_result === 'yea'
                              ? 'text-status-positive'
                              : vote.vote_result === 'nay'
                                ? 'text-status-negative'
                                : 'text-text-secondary'
                          }`}
                        >
                          {vote.vote_result.toUpperCase()}
                        </p>
                        {vote.policy_category && (
                          <p className="text-xs text-text-tertiary">{vote.policy_category}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-tertiary font-mono">No votes found</p>
            )}
          </div>

          {/* Comments Section */}
          <div>
            <h2 className="text-2xl font-bold font-mono mb-6">Community Discussion</h2>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="card">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-mono text-sm text-text-secondary">
                        {comment.user?.username || 'Anonymous'}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-text-primary mb-3">{comment.body}</p>
                    <div className="flex gap-4">
                      <button className="text-xs text-text-secondary hover:text-status-positive transition-colors">
                        👍 {comment.upvotes}
                      </button>
                      <button className="text-xs text-text-secondary hover:text-status-negative transition-colors">
                        👎 {comment.downvotes}
                      </button>
                      <button className="text-xs text-text-secondary hover:text-accent-primary transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-tertiary font-mono">No comments yet</p>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/politicians" className="text-accent-primary hover:text-accent-light font-mono">
              ← Back to Politicians
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
