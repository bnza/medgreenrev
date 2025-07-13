import { describe, expect, it } from 'vitest'
import { ApiRole } from '~/utils/consts/auth'
import { isAppRole } from '~/utils/guards'

describe('isAppRole', () => {
  it('should return true for a valid ApiRole', () => {
    expect(isAppRole(ApiRole.Admin)).toBe(true)
    expect(isAppRole(ApiRole.Editor)).toBe(true)
    expect(isAppRole(ApiRole.User)).toBe(true)
  })

  it('should return false for an invalid string value', () => {
    expect(isAppRole('INVALID_ROLE')).toBe(false)
  })

  it('should return false for a non-string value', () => {
    expect(isAppRole(123)).toBe(false)
    expect(isAppRole(true)).toBe(false)
    expect(isAppRole(null)).toBe(false)
    expect(isAppRole(undefined)).toBe(false)
    expect(isAppRole({})).toBe(false)
    expect(isAppRole([])).toBe(false)
  })
})
