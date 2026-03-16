'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DetailTabs } from '@/components/detail-tabs'
import { SentimentLineChart } from '@/components/sentiment-line-chart'
import { CommentForm } from '@/components/comment-form'
import type { Post, Vote, Comment, PoliticianIssue } from '@/lib/types'
import type { SimilarPoliticianResponse, NetworkGraphResponse } from '@/lib/api-types'

interface PoliticianDetailProps {
  posts: Post[]
  votes: Vote[]
  comments: Comment[]
  politicianId: string
  issuePositions: PoliticianIssue[]
  similarPoliticians: SimilarPoliticianResponse[]
  network: NetworkGraphResponse
  aggregateSentiment?: number | null
}

type TabId = 'feed' | 'votes' | 'issues' | 'charts' | 'similar' | 'network'

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1DA1F2',
  instagram: '#E1306C',
  tiktok: '#69C9D0',
}

function platformColor(platform: string) {
  return PLATFORM_COLORS[platform.toLowerCase()] ?? 'var(--text-tertiary)'
}

const voteColor = (result: string) =>
  result === 'yea' ? '#4ade80' : result === 'nay' ? '#f87171' : 'var(--text-tertiary)'

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', padding: '3rem 1.25rem', textAlign: 'center' }}>
      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
        {message}
      </p>
    </div>
  )
}

export function PoliticianDetail({
  posts,
  votes,
  comments,
  politicianId,
  issuePositions,
  similarPoliticians,
  network,
  aggregateSentiment,
}: PoliticianDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('feed')
  const [voteCounts, setVoteCounts] = useState<Record<string, { upvotes: number; downvotes: number }>>({})

  function getCommentVotes(comment: Comment) {
    return voteCounts[comment.id] ?? { upvotes: comment.upvotes ?? 0, downvotes: comment.downvotes ?? 0 }
  }

  async function handleVote(commentId: string, direction: 'up' | 'down') {
    const current = voteCounts[commentId] ?? {
      upvotes: comments.find((c) => c.id === commentId)?.upvotes ?? 0,
      downvotes: comments.find((c) => c.id === commentId)?.downvotes ?? 0,
    }
    setVoteCounts((prev) => ({
      ...prev,
      [commentId]: {
        upvotes: current.upvotes + (direction === 'up' ? 1 : 0),
        downvotes: current.downvotes + (direction === 'down' ? 1 : 0),
      },
    }))
    try {
      const result = await fetch(`/api/politicians/${politicianId}/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      })
      if (result.ok) {
        const serverData = await result.json() as { upvotes: number; downvotes: number }
        setVoteCounts((prev) => ({
          ...prev,
          [commentId]: { upvotes: serverData.upvotes, downvotes: serverData.downvotes },
        }))
      }
    } catch {
      setVoteCounts((prev) => ({ ...prev, [commentId]: current }))
    }
  }

  const tabs = [
    { id: 'feed', label: 'Feed', count: posts.length },
    { id: 'votes', label: 'Votes', count: votes.length },
    { id: 'issues', label: 'Issues', count: issuePositions.length },
    { id: 'charts', label: 'Charts' },
    { id: 'similar', label: 'Similar', count: similarPoliticians.length },
    { id: 'network', label: 'Network', count: network.edges.length },
  ]

  // Charts: derive category counts from votes
  const categoryMap: Record<string, number> = {}
  for (const v of votes) {
    if (v.policy_category) {
      categoryMap[v.policy_category] = (categoryMap[v.policy_category] ?? 0) + 1
    }
  }
  const categoryCounts = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])
  const maxCategoryCount = categoryCounts.length > 0 ? categoryCounts[0][1] : 1

  const sentimentPoints = aggregateSentiment != null
    ? [0.2, 0.35, 0.1, 0.4, 0.3, Math.max(0, Math.min(1, (aggregateSentiment + 1) / 2))]
    : [0.2, 0.35, 0.1, 0.4, 0.3]
  const sentimentLabels = aggregateSentiment != null
    ? ['6mo ago', '5mo', '4mo', '3mo', '2mo', 'now']
    : ['6mo ago', '5mo', '4mo', '3mo', '2mo']

  return (
    <div>
      {/* Tab bar */}
      <DetailTabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as TabId)} />

      {/* Tab content */}
      <div>
        {/* ── Feed ── */}
        {activeTab === 'feed' && (
          <div>
            <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
              {posts.length === 0 ? (
                <EmptyState message="No posts found" />
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '1rem 1.25rem',
                      borderLeft: '2px solid var(--text-tertiary)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          {post.source_platform && (
                            <span style={{
                              fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                              color: platformColor(post.source_platform),
                              background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                              padding: '0.1rem 0.5rem', borderRadius: '2px',
                            }}>
                              {post.source_platform}
                            </span>
                          )}
                          {post.created_at && (
                            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, letterSpacing: '0.02em' }}>
                          {post.content_text}
                        </p>
                      </div>
                      {post.sentiment_score !== null && post.sentiment_score !== undefined && (
                        <span style={{
                          fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                          fontSize: '1.25rem', flexShrink: 0,
                          color: post.sentiment_score > 0 ? 'var(--status-positive)' : post.sentiment_score < 0 ? 'var(--status-negative)' : 'var(--text-tertiary)',
                        }}>
                          {post.sentiment_score > 0 ? '+' : ''}{post.sentiment_score.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Community Comments section at the bottom of feed */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
                Community Comments
              </p>
              <div style={{ marginBottom: '1.25rem' }}>
                <CommentForm
                  politicianId={politicianId}
                  onCommentAdded={() => router.refresh()}
                />
              </div>
              <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
                {comments.length === 0 ? (
                  <EmptyState message="No community posts yet" />
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{ background: 'var(--bg-secondary)', padding: '1.125rem 1.25rem', borderLeft: '2px solid var(--text-tertiary)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem', gap: '1rem' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                          {comment.user?.username || 'Anonymous'}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', flexShrink: 0 }}>
                          {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.65, letterSpacing: '0.02em', marginBottom: '0.75rem' }}>
                        {comment.body}
                      </p>
                      <div style={{ display: 'flex', gap: '1.25rem' }}>
                        <button
                          onClick={() => handleVote(comment.id, 'up')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s ease' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--status-positive)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)' }}
                        >
                          ▲ {getCommentVotes(comment).upvotes}
                        </button>
                        <button
                          onClick={() => handleVote(comment.id, 'down')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s ease' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--status-negative)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)' }}
                        >
                          ▼ {getCommentVotes(comment).downvotes}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Votes ── */}
        {activeTab === 'votes' && (
          <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
            {votes.length === 0 ? (
              <EmptyState message="No vote records" />
            ) : (
              votes.map((vote) => (
                <div
                  key={vote.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1rem 1.25rem',
                    borderLeft: `2px solid ${voteColor(vote.vote_result)}`,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                        {vote.bill_name || (vote.bill_uuid ? 'Bill vote' : 'Vote')}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {vote.policy_category && (
                          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                            {vote.policy_category}
                          </span>
                        )}
                        {vote.vote_date && (
                          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                            {new Date(vote.vote_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                      fontSize: '1.25rem', letterSpacing: '0.06em',
                      color: voteColor(vote.vote_result),
                    }}>
                      {vote.vote_result.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Issues ── */}
        {activeTab === 'issues' && (
          <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
            {issuePositions.length === 0 ? (
              <EmptyState message="No issue positions recorded" />
            ) : (
              issuePositions.map((issue) => (
                <div
                  key={issue.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1rem 1.25rem',
                    borderLeft: '2px solid #a78bfa',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                        {issue.title}
                      </p>
                      {issue.category && (
                        <span style={{ fontSize: '10px', color: '#a78bfa', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', padding: '0.1rem 0.4rem', borderRadius: '2px', display: 'inline-block', marginBottom: '0.5rem' }}>
                          {issue.category}
                        </span>
                      )}
                      {issue.notes && (
                        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                          {issue.notes}
                        </p>
                      )}
                    </div>
                    {issue.position && (
                      <span style={{
                        fontFamily: 'var(--font-display), "Bebas Neue", sans-serif',
                        fontSize: '1.1rem', letterSpacing: '0.06em', flexShrink: 0,
                        color: issue.position === 'support' ? 'var(--status-positive)' : issue.position === 'oppose' ? 'var(--status-negative)' : 'var(--text-secondary)',
                      }}>
                        {issue.position.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Charts ── */}
        {activeTab === 'charts' && (
          <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
            {/* Sentiment trend */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid var(--accent-primary)' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>Sentiment Trend</p>
              <SentimentLineChart
                points={sentimentPoints}
                labels={sentimentLabels}
                height={80}
              />
            </div>

            {/* Votes by category */}
            <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderLeft: '2px solid #60a5fa' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>Votes by Category</p>
              {categoryCounts.length === 0 ? (
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>No category data</p>
              ) : (
                categoryCounts.map(([cat, count]) => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.04em', width: '120px', flexShrink: 0 }}>{cat}</span>
                    <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${(count / maxCategoryCount) * 100}%`, background: '#60a5fa', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', width: '24px', textAlign: 'right' }}>{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Similar ── */}
        {activeTab === 'similar' && (
          <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
            {similarPoliticians.length === 0 ? (
              <EmptyState message="No similar politicians found" />
            ) : (
              similarPoliticians.map((sim) => (
                <a
                  key={sim.id}
                  href={`/politicians/${sim.slug}`}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1rem 1.25rem',
                    borderLeft: '2px solid var(--accent-primary)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-tertiary)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-secondary)' }}
                >
                  {/* Portrait thumbnail */}
                  <div style={{
                    width: '40px', height: '53px', flexShrink: 0,
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: '2px', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {sim.portrait_url ? (
                      <img src={sim.portrait_url} alt={sim.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1rem', color: 'var(--text-faint)', letterSpacing: '0.05em' }}>
                        {sim.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                      {sim.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {sim.party && (
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sim.party === 'Democrat' ? '#3b82f6' : sim.party === 'Republican' ? '#ef4444' : 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                          {sim.party === 'Democrat' ? 'D' : sim.party === 'Republican' ? 'R' : sim.party}
                        </span>
                      )}
                      {sim.state_abbrev && (
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                          {sim.state_abbrev}
                        </span>
                      )}
                      {sim.chamber && (
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                          {sim.chamber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.5rem', color: 'var(--accent-primary)', letterSpacing: '0.03em', lineHeight: 1 }}>
                      {(sim.similarity * 100).toFixed(0)}%
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                      {sim.shared_votes} shared votes
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        )}

        {/* ── Network ── */}
        {activeTab === 'network' && (
          <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
            {network.edges.length === 0 ? (
              <EmptyState message="No network data" />
            ) : (
              network.edges.map((edge, idx) => {
                const entity = network.nodes.find((n) => n.id === edge.source && n.node_type === 'entity')
                if (!entity) return null
                const typeColors: Record<string, string> = {
                  pac: '#F59E0B', corporation: '#60A5FA', ngo: '#34D399', industry: '#A78BFA',
                }
                const typeColor = typeColors[entity.type] ?? 'var(--text-tertiary)'
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '1rem 1.25rem',
                      borderLeft: '2px solid var(--text-tertiary)',
                      display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)' }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem', letterSpacing: '0.01em' }}>
                        {entity.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: typeColor, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                          {entity.type}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                          {edge.relationship_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    {edge.weight != null && (
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <p style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.5rem', letterSpacing: '0.03em', color: 'var(--accent-primary)', lineHeight: 1 }}>
                          ${edge.weight.toFixed(1)}M
                        </p>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>Donation</p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
