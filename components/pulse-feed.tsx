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
      <div className="text-center py-12">
        <p className="text-text-tertiary font-mono">No posts found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}

function PostItem({ post }: { post: Post }) {
  const sentimentClass =
    post.sentiment_score > 0
      ? 'text-status-positive'
      : post.sentiment_score < 0
        ? 'text-status-negative'
        : 'text-text-secondary'

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div>
          {post.source_platform && (
            <p className="text-xs font-mono text-text-tertiary mb-1">{post.source_platform}</p>
          )}
          <p className="text-xs text-text-secondary">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`text-sm font-mono font-bold ${sentimentClass}`}>
          {post.sentiment_score > 0 ? '+' : ''}{post.sentiment_score.toFixed(2)}
        </span>
      </div>

      <p className="text-text-primary mb-3 leading-relaxed">{post.content_text}</p>

      {post.source_url && (
        <a
          href={post.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-primary text-xs font-mono hover:text-accent-light transition-colors"
        >
          View Source →
        </a>
      )}
    </div>
  )
}
