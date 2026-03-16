'use client'

interface SentimentLineChartProps {
  points: number[]
  labels?: string[]
  height?: number
  width?: number
}

const VIEW_W = 400
const PADDING = 8

export function SentimentLineChart({
  points,
  labels,
  height = 80,
}: SentimentLineChartProps) {
  if (points.length === 0) return null

  const VIEW_H = height
  const usableH = VIEW_H - PADDING * 2

  // Normalize points to [0, 1] range
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min === 0 ? 1 : max - min

  function toY(v: number): number {
    const normalized = (v - min) / range
    // Flip so higher = top
    return PADDING + (1 - normalized) * usableH
  }

  function toX(i: number): number {
    if (points.length === 1) return VIEW_W / 2
    return (i / (points.length - 1)) * VIEW_W
  }

  const coords = points.map((v, i) => ({ x: toX(i), y: toY(v) }))

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ')

  // Area fill path: line + down to bottom-right + across bottom + up to bottom-left
  const areaPath =
    points.length === 1
      ? ''
      : [
          `M ${coords[0].x},${coords[0].y}`,
          ...coords.slice(1).map((c) => `L ${c.x},${c.y}`),
          `L ${coords[coords.length - 1].x},${VIEW_H}`,
          `L ${coords[0].x},${VIEW_H}`,
          'Z',
        ].join(' ')

  const gradientId = 'sentiment-gradient'

  return (
    <div>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#40916c" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#40916c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        {points.length > 1 && (
          <path d={areaPath} fill={`url(#${gradientId})`} />
        )}

        {/* Line */}
        {points.length > 1 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#40916c"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Dots */}
        {coords.map((c, i) => {
          const isLast = i === coords.length - 1
          return (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={isLast ? 4 : 2.5}
              fill={isLast ? '#4ade80' : '#40916c'}
            />
          )
        })}
      </svg>

      {/* X-axis labels */}
      {labels && labels.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.375rem',
          }}
        >
          {labels.map((label, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
