import Link from 'next/link'
import type { Politician } from '@/lib/types'

interface PoliticianCardProps {
  politician: Politician
}

export function PoliticianCard({ politician }: PoliticianCardProps) {
  const sentimentClass =
    politician.aggregate_sentiment > 0
      ? 'text-status-positive'
      : politician.aggregate_sentiment < 0
        ? 'text-status-negative'
        : 'text-text-secondary'

  const endorsementBgClass =
    politician.endorsement_status === 'endorsed'
      ? 'bg-status-positive/10 border-status-positive'
      : politician.endorsement_status === 'anti-endorsed'
        ? 'bg-status-negative/10 border-status-negative'
        : 'bg-neutral-muted border-neutral-muted'

  return (
    <Link href={`/politicians/${politician.slug}`}>
      <div className="card hover:border-accent-primary transition-colors cursor-pointer h-full flex flex-col">
        {politician.portrait_url && (
          <div className="mb-4 -m-6 mb-4 bg-gradient-to-b from-neutral-muted to-bg-tertiary p-4">
            <img
              src={politician.portrait_url}
              alt={politician.name}
              className="w-full h-40 object-cover rounded"
            />
          </div>
        )}

        <h3 className="font-bold text-lg mb-1 text-text-primary">{politician.name}</h3>

        <p className="text-sm font-mono text-text-secondary mb-3">{politician.title}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {politician.party && (
            <span className="text-xs font-mono bg-neutral-muted px-2 py-1 rounded">
              {politician.party}
            </span>
          )}
          {politician.office_held && (
            <span className="text-xs font-mono bg-neutral-muted px-2 py-1 rounded">
              {politician.office_held}
            </span>
          )}
        </div>

        <p className="text-xs text-text-tertiary mb-4 line-clamp-2">{politician.bio}</p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary">Sentiment</span>
            <span className={`font-mono font-bold ${sentimentClass}`}>
              {politician.aggregate_sentiment.toFixed(2)}
            </span>
          </div>

          <div
            className={`border rounded px-2 py-1 text-xs font-mono font-bold text-center ${endorsementBgClass}`}
          >
            {politician.endorsement_status === 'endorsed'
              ? '✓ Endorsed'
              : politician.endorsement_status === 'anti-endorsed'
                ? '✗ Opposed'
                : '○ Watching'}
          </div>
        </div>
      </div>
    </Link>
  )
}
