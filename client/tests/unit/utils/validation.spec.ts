import { describe, expect, it } from 'vitest'
import {
  flattenRegleErrors,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
} from '~/utils/validation'

describe('validation utils', () => {
  describe('flattenRegleErrors', () => {
    it('should return undefined if errors is undefined', () => {
      expect(flattenRegleErrors(undefined)).toBeUndefined()
    })

    it('should flatten simple string errors', () => {
      const errors = 'Error message' as any
      expect(flattenRegleErrors(errors)).toEqual(['Error message'])
    })

    it('should flatten array of strings', () => {
      const errors = ['Error 1', 'Error 2'] as any
      expect(flattenRegleErrors(errors)).toEqual(['Error 1', 'Error 2'])
    })

    it('should flatten nested object errors', () => {
      const errors = {
        field1: 'Error 1',
        field2: ['Error 2', 'Error 3'],
        nested: {
          field3: 'Error 4',
        },
      } as any
      expect(flattenRegleErrors(errors)).toEqual([
        'Error 1',
        'Error 2',
        'Error 3',
        'Error 4',
      ])
    })
  })

  describe('comparison rules', () => {
    describe('greaterThan', () => {
      const rule = greaterThan()
      it('should return true if value is greater than otherValue', () => {
        expect(rule.validator(10, 5)).toBe(true)
        expect(rule.validator('10', '5')).toBe(true)
      })
      it('should return false if value is less than or equal to otherValue', () => {
        expect(rule.validator(5, 10)).toBe(false)
        expect(rule.validator(5, 5)).toBe(false)
        expect(rule.validator('5', '10')).toBe(false)
      })
      it('should return true if values are not finite numbers', () => {
        expect(rule.validator('', 5)).toBe(true)
        expect(rule.validator(5, '')).toBe(true)
        expect(rule.validator(undefined, 5)).toBe(true)
      })
      it('should use custom message', () => {
        const customRule = greaterThan('Custom error message')
        const message =
          typeof customRule.message === 'function'
            ? (customRule.message as any)()
            : customRule.message
        expect(message).toBe('Custom error message')
      })
    })

    describe('greaterThanOrEqual', () => {
      const rule = greaterThanOrEqual()
      it('should return true if value is greater than or equal to otherValue', () => {
        expect(rule.validator(10, 5)).toBe(true)
        expect(rule.validator(5, 5)).toBe(true)
        expect(rule.validator('10', '5')).toBe(true)
      })
      it('should return false if value is less than otherValue', () => {
        expect(rule.validator(5, 10)).toBe(false)
        expect(rule.validator('5', '10')).toBe(false)
      })
      it('should return true if values are not finite numbers', () => {
        expect(rule.validator('', 5)).toBe(true)
        expect(rule.validator(undefined, 5)).toBe(true)
      })
      it('should use custom message', () => {
        const customRule = greaterThanOrEqual('Custom error message')
        const message =
          typeof customRule.message === 'function'
            ? (customRule.message as any)()
            : customRule.message
        expect(message).toBe('Custom error message')
      })
    })

    describe('lessThan', () => {
      const rule = lessThan()
      it('should return true if value is less than otherValue', () => {
        expect(rule.validator(5, 10)).toBe(true)
        expect(rule.validator('5', '10')).toBe(true)
      })
      it('should return false if value is greater than or equal to otherValue', () => {
        expect(rule.validator(10, 5)).toBe(false)
        expect(rule.validator(5, 5)).toBe(false)
      })
      it('should return true if values are not finite numbers', () => {
        expect(rule.validator('', 5)).toBe(true)
      })
      it('should use custom message', () => {
        const customRule = lessThan('Custom error message')
        const message =
          typeof customRule.message === 'function'
            ? (customRule.message as any)()
            : customRule.message
        expect(message).toBe('Custom error message')
      })
    })

    describe('lessThanOrEqual', () => {
      const rule = lessThanOrEqual()
      it('should return true if value is less than or equal to otherValue', () => {
        expect(rule.validator(5, 10)).toBe(true)
        expect(rule.validator(5, 5)).toBe(true)
      })
      it('should return false if value is greater than otherValue', () => {
        expect(rule.validator(10, 5)).toBe(false)
      })
      it('should return true if values are not finite numbers', () => {
        expect(rule.validator('', 5)).toBe(true)
      })
      it('should use custom message', () => {
        const customRule = lessThanOrEqual('Custom error message')
        const message =
          typeof customRule.message === 'function'
            ? (customRule.message as any)()
            : customRule.message
        expect(message).toBe('Custom error message')
      })
    })
  })
})
