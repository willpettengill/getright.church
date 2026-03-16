'use client'

interface Tab {
  id: string
  label: string
  count?: number
}

interface DetailTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function DetailTabs({ tabs, activeTab, onTabChange }: DetailTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive
                ? '2px solid var(--accent-primary)'
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  'var(--text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  'var(--text-secondary)'
              }
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.04em',
                  fontWeight: 400,
                }}
              >
                ({tab.count})
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
