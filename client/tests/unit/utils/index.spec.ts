import { describe, expect, it } from 'vitest'
import { isAppPathItemPage } from '~/utils'

describe('isAppPathItemPage', () => {
  it('should return true for a valid UUID v4 Iri', () => {
    const path = '/api/users/1f06335e-d167-6a42-a6b6-b5923121c6cc'
    expect(isAppPathItemPage(path)).to.equal(true)
  })

  it('should return true for a valid UUID v4', () => {
    const path = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    expect(isAppPathItemPage(path)).to.equal(true)
  })

  it('should return true for a string ending with digits', () => {
    const path = '/items/12345'
    expect(isAppPathItemPage(path)).to.equal(true)
  })

  it('should return false for a string without digits or UUID v4', () => {
    const path = '/items/item-page'
    expect(isAppPathItemPage(path)).to.equal(false)
  })

  it('should return false for an empty string', () => {
    const path = ''
    expect(isAppPathItemPage(path)).to.equal(false)
  })

  it('should return false for a malformed UUID v4', () => {
    const path = 'f47ac10b-58cc-4372-a567-0e02b2c3d47x' // invalid character at the end
    expect(isAppPathItemPage(path)).to.equal(false)
  })

  it('should return true for a path containing only digits', () => {
    const path = '12345'
    expect(isAppPathItemPage(path)).to.equal(true)
  })
})
