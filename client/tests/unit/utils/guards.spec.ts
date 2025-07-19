import { describe, it, expect } from 'vitest'
import generatePassword from '~/utils/generatePassword'

describe('generatePassword', () => {
  it('generates unique identifiable keys with default length 10', () => {
    const password = generatePassword()
    expect(password.length).to.equal(10)
  })

  it('generates password with at least minimum length 8', () => {
    const shortLengthPassword = generatePassword(5) // request length < 8
    expect(shortLengthPassword.length).to.be.at.least(8)
  })

  it('generates password with requested length when >= 8', () => {
    const length = 15
    const password = generatePassword(length)
    expect(password.length).to.equal(length)
  })

  it('password contains at least one digit, uppercase, lowercase and special character', () => {
    const password = generatePassword(20)

    // regex patterns for each category
    const hasDigit = /\d/
    const hasUppercase = /[A-Z]/
    const hasLowercase = /[a-z]/
    const hasSpecial = /[!@#$%^&*()]/

    expect(hasDigit.test(password)).to.equal(true)
    expect(hasUppercase.test(password)).to.equal(true)
    expect(hasLowercase.test(password)).to.equal(true)
    expect(hasSpecial.test(password)).to.equal(true)
  })

  it('generates different passwords on multiple calls', () => {
    const password1 = generatePassword()
    const password2 = generatePassword()
    expect(password1).to.not.equal(password2)
  })
})
