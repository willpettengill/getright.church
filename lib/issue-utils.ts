export const CATEGORY_COLORS: Record<string, string> = {
  'civil-rights': '#40916c',
  'civil rights':  '#40916c',
  economy:         '#f59e0b',
  environment:     '#4ade80',
  healthcare:      '#60a5fa',
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? 'var(--text-tertiary)'
}
