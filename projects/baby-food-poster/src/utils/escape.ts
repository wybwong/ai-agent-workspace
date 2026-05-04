export function escapeHtml(str: string): string {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function truncate(str: string, max = 500): string {
  const s = String(str || '')
  return s.length > max ? s.slice(0, max) : s
}
