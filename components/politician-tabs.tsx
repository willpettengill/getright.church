'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, Vote, Comment, PoliticianIssue } from '@/lib/types'
import { CommentForm } from '@/components/comment-form'
import type { NetworkGraphResponse } from '@/lib/api-types'

interface PoliticianTabsProps {
  posts: Post[]
  votes: Vote[]
  comments: Comment[]
  politicianId: string
  issuePositions?: PoliticianIssue[]
  network?: NetworkGraphResponse
}

type Tab = 'feed' | 'votes' | 'community' | 'issues' | 'network'

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1DA1F2',
  instagram: '#E1306C',
  tiktok: '#69C9D0',
}

export function PoliticianTabs({ posts, votes, comments, politicianId, issuePositions, network }: PoliticianTabsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('feed')
  const [voteCounts, setVoteCounts] = useState<Record<string, { upvotes: number; downvotes: number }>>({})

  function getVotes(comment: Comment) {
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

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'feed',      label: 'The Feed',       count: posts.length },
    { id: 'votes',     label: 'Voting Record',  count: votes.length },
    { id: 'community', label: 'Community',      count: comments.length },
    { id: 'issues',    label: 'Issues',         count: (issuePositions ?? []).length },
    { id: 'network',   label: 'Network',        count: (network?.edges ?? []).length },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          marginBottom: '2rem',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeTab === tab.id ? 'var(--accent-light)' : 'var(--text-tertiary)',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)'
              }
            }}
          >
            {tab.label}
            <span
              style={{
                padding: '0.1rem 0.4rem',
                background: activeTab === tab.id ? 'var(--accent-glow)' : 'var(--bg-tertiary)',
                border: `1px solid ${activeTab === tab.id ? 'rgba(64,145,108,0.3)' : 'var(--border)'}`,
                borderRadius: '2px',
                fontSize: '10px',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-tertiary)',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── The Feed ── */}
      {activeTab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {posts.length === 0 ? (
            <EmptyState message="No posts found" />
          ) : (
            posts.map((post) => {
              const score = post.sentiment_score ?? 0
              const sentimentColor =
                score > 0.3
                  ? 'var(--status-positive)'
                  : score < -0.3
                    ? 'var(--status-negative)'
                    : 'var(--text-tertiary)'
              const platformColor = PLATFORM_COLORS[post.source_platform?.toLowerCase()] ?? 'var(--text-tertiary)'
              return (
                <div
                  key={post.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1.125rem 1.25rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: platformColor }}>
                        {post.source_platform}
                      </span>
                      <span style={{ width: '1px', height: '10px', background: 'var(--border)' }} />
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.65, letterSpacing: '0.02em' }}>
                      {post.content_text}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: '1.5rem', letterSpacing: '0.03em', color: sentimentColor, lineHeight: 1 }}>
                      {score > 0 ? '+' : ''}{score.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>Signal</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── Voting Record ── */}
      {activeTab === 'votes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
          {votes.length === 0 ? (
            <EmptyState message="No vote records" />
          ) : (
            votes.map((vote) => {
              const voteStyle =
                vote.vote_result === 'yea'
                  ? { color: 'var(--status-positive)', bg: 'rgba(74, 222, 128, 0.06)', border: 'rgba(74, 222, 128, 0.3)' }
                  : vote.vote_result === 'nay'
                    ? { color: 'var(--status-negative)', bg: 'rgba(248, 113, 113, 0.06)', border: 'rgba(248, 113, 113, 0.3)' }
                    : { color: 'var(--text-tertiary)', bg: 'var(--bg-tertiary)', border: 'var(--border)' }
              return (
                <div
                  key={vote.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    justifyContent: 'space-between',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem', letterSpacing: '0.01em' }}>
                      {vote.bill_name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {vote.bill_id && (
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
                          {vote.bill_id}
                        </span>
                      )}
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                        {vote.vote_date
                          ? new Date(vote.vote_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : new Date(vote.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {vote.policy_category && (
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '0.1rem 0.375rem', borderRadius: '2px' }}>
                          {vote.policy_category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      flexShrink: 0,
                      padding: '0.3rem 0.75rem',
                      background: voteStyle.bg,
                      border: `1px solid ${voteStyle.border}`,
                      borderRadius: '2px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: voteStyle.color,
                    }}
                  >
                    {vote.vote_result}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── Community ── */}
      {activeTab === 'community' && (
        <div>
          {/* Comment form */}
          <div style={{ padding: '1.5rem 0', marginBottom: '0.5rem' }}>
            <CommentForm
              politicianId={politicianId}
              onCommentAdded={() => router.refresh()}
            />
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 1px' }} />
          {/* Comments list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {comments.length === 0 ? (
              <EmptyState message="No community posts yet" />
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1.125rem 1.25rem',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-tertiary)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem', gap: '1rem' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.04em', flexShrink: 0 }}>
                      {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.65, letterSpacing: '0.02em', marginBottom: '0.75rem' }}>
                    {comment.body}
                  </p>
                  <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <button
                      onClick={() => handleVote(comment.id, 'up')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--status-positive)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)'
                      }}
                    >
                      ▲ {getVotes(comment).upvotes}
                    </button>
                    <button
                      onClick={() => handleVote(comment.id, 'down')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--status-negative)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)'
                      }}
                    >
                      ▼ {getVotes(comment).downvotes}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* ── Issues ── */}
      {activeTab === 'issues' && (
        <div>
          {(issuePositions ?? []).length === 0 ? (
            <EmptyState message="No issue positions recorded" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {(issuePositions ?? []).map((ip) => {
                const posColor = ip.position === 'support' ? 'var(--status-positive)' : ip.position === 'oppose' ? 'var(--status-negative)' : 'var(--text-tertiary)'
                const posBg = ip.position === 'support' ? 'rgba(74, 222, 128, 0.06)' : ip.position === 'oppose' ? 'rgba(248, 113, 113, 0.06)' : 'var(--bg-tertiary)'
                const posBorder = ip.position === 'support' ? 'rgba(74, 222, 128, 0.3)' : ip.position === 'oppose' ? 'rgba(248, 113, 113, 0.3)' : 'var(--border)'
                return (
                  <div key={ip.id} style={{ background: 'var(--bg-secondary)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{ip.title}</p>
                      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{ip.category}</p>
                      {ip.notes && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '0.375rem', lineHeight: 1.5 }}>{ip.notes}</p>}
                    </div>
                    <span style={{ flexShrink: 0, padding: '0.3rem 0.75rem', background: posBg, border: `1px solid ${posBorder}`, borderRadius: '2px', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: posColor }}>
                      {ip.position}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Network ── */}
      {activeTab === 'network' && (
        <div>
          {(network?.edges ?? []).length === 0 ? (
            <EmptyState message="No network data" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {(network?.edges ?? []).map((edge, i) => {
                const entity = network?.nodes.find(n => n.id === edge.source && n.node_type === 'entity')
                if (!entity) return null
                const typeColors: Record<string, string> = {
                  pac: '#F59E0B',
                  corporation: '#60A5FA',
                  ngo: '#34D399',
                  industry: '#A78BFA',
                }
                const typeColor = typeColors[entity.type] ?? 'var(--text-tertiary)'
                return (
                  <div
                    key={`${edge.source}-${edge.relationship_type}`}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      justifyContent: 'space-between',
                      transition: 'background 0.1s ease',
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
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        padding: '3rem 1.25rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
        }}
      >
        {message}
      </p>
    </div>
  )
}
