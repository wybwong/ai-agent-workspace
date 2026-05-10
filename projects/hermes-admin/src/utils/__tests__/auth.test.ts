import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken } from '../auth'

describe('auth token utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getToken returns empty string when no token is stored', () => {
    expect(getToken()).toBe('')
  })

  it('setToken and getToken round-trip', () => {
    setToken('abc-token')
    expect(getToken()).toBe('abc-token')
  })

  it('removeToken clears both access and refresh tokens', () => {
    setToken('access')
    setRefreshToken('refresh')
    removeToken()
    expect(getToken()).toBe('')
    expect(getRefreshToken()).toBe('')
  })

  it('getRefreshToken returns empty string when no refresh token is stored', () => {
    expect(getRefreshToken()).toBe('')
  })

  it('setRefreshToken and getRefreshToken round-trip', () => {
    setRefreshToken('refresh-xyz')
    expect(getRefreshToken()).toBe('refresh-xyz')
  })
})
