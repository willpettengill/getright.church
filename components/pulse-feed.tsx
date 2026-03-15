import { getPosts } from '@/lib/api'
import type { Post } from '@/lib/types'

interface PulseFeedProps {
  geographyId?: string
  politicianId?: string
}

export async function PulseFeed({ geographyId, politicianId }: PulseFeedProps) {
  const posts = await getPosts(geographyId, politicianId, 20)

  if (posts.length === 0) {
    return (
      <div className="pulse-empty">
        <p className="pulse-empty-text">No signals yet</p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .pulse-empty {
          text-align: center;
          padding: 4rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 2px;
        }
        .pulse-empty-text {
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          margin: 0;
        }
        .pulse-feed {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: var(--border);
        }
        .pulse-item {
          background: var(--bg-secondary);
          padding: 1.125rem 1.25rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: start;
          transition: background 0.1s ease;
        }
        .pulse-item:hover {
          background: var(--bg-tertiary);
        }
        .pulse-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .pulse-platform {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .pulse-divider {
          width: 1px;
          height: 10px;
          background: var(--border);
          flex-shrink: 0;
        }
        .pulse-date {
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 0.04em;
        }
        .pulse-content {
          font-size: var(--text-sm);
          color: var(--text-primary);
          line-height: 1.65;
          letter-spacing: 0.02em;
          margin: 0;
        }
        .pulse-source {
          display: inline-block;
          margin-top: 0.5rem;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent-primary);
          transition: color 0.15s ease;
        }
        .pulse-source:hover {
          color: var(--accent-light);
        }
        .pulse-score {
          text-align: right;
          flex-shrink: 0;
        }
        .pulse-score-value {
          font-family: var(--font-display), "Bebas Neue", sans-serif;
          font-size: 1.75rem;
          letter-spacing: 0.03em;
          line-height: 1;
          margin: 0;
        }
        .pulse-score-label {
          font-size: 10px;
          color: var(--text-tertiary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 0.25rem;
          margin-bottom: 0;
        }
      `}</style>
      <div className="pulse-feed">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#1DA1F2',
  instagram: '#E1306C',
  tiktok: '#69C9D0',
  facebook: '#4267B2',
}

function PostItem({ post }: { post: Post }) {
  const score = post.sentiment_score ?? 0
  const sentimentColor =
    score > 0.3
      ? 'var(--status-positive)'
      : score < -0.3
        ? 'var(--status-negative)'
        : 'var(--text-tertiary)'

  const platformColor = PLATFORM_COLORS[post.source_platform?.toLowerCase()] ?? 'var(--text-tertiary)'

  return (
    <div className="pulse-item">
      <div>
        <div className="pulse-meta">
          <span className="pulse-platform" style={{ color: platformColor }}>
            {post.source_platform}
          </span>
          <span className="pulse-divider" />
          <span className="pulse-date">
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <p className="pulse-content">{post.content_text}</p>
        {post.source_url && (
          <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="pulse-source">
            View Source →
          </a>
        )}
      </div>
      <div className="pulse-score">
        <p className="pulse-score-value" style={{ color: sentimentColor }}>
          {score > 0 ? '+' : ''}{score.toFixed(2)}
        </p>
        <p className="pulse-score-label">Signal</p>
      </div>
    </div>
  )
}
