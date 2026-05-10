import { describe, it, expect } from 'vitest'
import { formatDate, formatNumber, formatFileSize } from '../format'

describe('formatDate', () => {
  it('returns empty string for falsy input', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate(0)).toBe('')
  })

  it('formats a date string with default pattern', () => {
    const result = formatDate('2024-06-15 08:30:00')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    expect(result.startsWith('2024-06-15')).toBe(true)
  })

  it('formats with a custom pattern', () => {
    expect(formatDate('2024-01-05 00:00:00', 'YYYY/MM/DD')).toBe('2024/01/05')
  })

  it('returns empty string for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('')
  })
})

describe('formatNumber', () => {
  it('formats a number to 2 decimal places by default', () => {
    const result = formatNumber(1234567.891)
    expect(result).toContain('1,234,567')
  })

  it('formats to the specified number of decimal places', () => {
    const result = formatNumber(3.14159, 3)
    expect(result).toContain('3.14')
  })
})

describe('formatFileSize', () => {
  it('returns bytes for values under 1 KB', () => {
    expect(formatFileSize(512)).toBe('512 B')
  })

  it('returns KB for values between 1 KB and 1 MB', () => {
    expect(formatFileSize(2048)).toBe('2.00 KB')
  })

  it('returns MB for values between 1 MB and 1 GB', () => {
    expect(formatFileSize(1024 * 1024 * 3)).toBe('3.00 MB')
  })

  it('returns GB for values 1 GB or more', () => {
    expect(formatFileSize(1024 * 1024 * 1024 * 2)).toBe('2.00 GB')
  })
})
