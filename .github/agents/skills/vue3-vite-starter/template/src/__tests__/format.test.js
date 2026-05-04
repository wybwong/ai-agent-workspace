import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/format'

describe('formatDate', () => {
  it('空值返回 -', () => {
    expect(formatDate(null)).toBe('-')
    expect(formatDate('')).toBe('-')
    expect(formatDate(undefined)).toBe('-')
  })

  it('默认格式化为 YYYY-MM-DD', () => {
    const result = formatDate('2024-06-15T08:00:00Z')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('格式化为 YYYY-MM-DD HH:mm:ss', () => {
    const result = formatDate(new Date('2024-06-15T08:30:45'), 'YYYY-MM-DD HH:mm:ss')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  it('自定义格式仅返回年份', () => {
    const result = formatDate(new Date('2024-01-01'), 'YYYY')
    expect(result).toBe('2024')
  })
})
