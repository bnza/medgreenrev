import { describe, it, expect } from 'vitest'
import generatePassword from '~/utils/generatePassword'
import { isValidIri } from '~/utils'

describe('guards', () => {
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

    describe('isValidIri', () => {
      it('should return false for inventory numbers like ME002/2023', () => {
        const inventory = 'ME002/2023'
        expect(isValidIri(inventory)).toBe(false)
      })

      it('should return true for actual API IRIs', () => {
        expect(isValidIri('/api/data/potteries/123')).toBe(true)
        expect(isValidIri('/api/data/stratigraphic_units/456')).toBe(true)
      })
    })
  })
})
