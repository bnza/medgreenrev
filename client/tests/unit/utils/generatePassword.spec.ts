import { describe, it, expect } from 'vitest'
import generatePassword from '~/utils/generatePassword'

describe('generatePassword', () => {
  it('generates unique identifiable keys with default length 10', () => {
    const password = generatePassword()
    expect(password.length).toBe(10)
  })

  it('generates password with at least minimum length 8', () => {
    const shortLengthPassword = generatePassword(5) // request length < 8
    expect(shortLengthPassword.length).toBeGreaterThanOrEqual(8)
  })

  it('generates password with requested length when >= 8', () => {
    const length = 15
    const password = generatePassword(length)
    expect(password.length).toBe(length)
  })

  it('password contains at least one digit, uppercase, lowercase and special character', () => {
    const password = generatePassword(20)

    // regex patterns for each category
    const hasDigit = /\d/
    const hasUppercase = /[A-Z]/
    const hasLowercase = /[a-z]/
    const hasSpecial = /[!@#$%^&*()]/

    expect(hasDigit.test(password)).toBe(true)
    expect(hasUppercase.test(password)).toBe(true)
    expect(hasLowercase.test(password)).toBe(true)
    expect(hasSpecial.test(password)).toBe(true)
  })

  it('generates different passwords on multiple calls', () => {
    const password1 = generatePassword()
    const password2 = generatePassword()
    expect(password1).not.toBe(password2)
  })
})
