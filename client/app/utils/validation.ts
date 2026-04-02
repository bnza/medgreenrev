import {
  createRule,
  type Maybe,
  type RegleErrorTree,
  type RegleRuleDefinition,
} from '@regle/core'

export const flattenRegleErrors = (
  errors: RegleErrorTree<any, any> | undefined,
): string[] | undefined => {
  if (!errors) return undefined

  const result: string[] = []

  function recurse(errorNode: any) {
    if (typeof errorNode === 'string') {
      result.push(errorNode)
    } else if (Array.isArray(errorNode)) {
      errorNode.forEach((e) => recurse(e))
    } else if (typeof errorNode === 'object' && errorNode !== null) {
      for (const key in errorNode) {
        recurse(errorNode[key])
      }
    }
    return result
  }

  return recurse(errors)
}

const toMaybeNumber = (value: Maybe<number | string>): Maybe<number> => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    return value.trim() === '' ? undefined : Number(value)
  }
  return undefined
}

type Operator = '<' | '<=' | '>' | '>='

const operators: Record<Operator, (a: number, b: number) => boolean> = {
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
}

const createComparisonRule = (operator: Operator, message: string) =>
  createRule({
    validator: (
      value: Maybe<number | string>,
      otherValue: Maybe<number | string>,
    ) => {
      const valueNumber = toMaybeNumber(value)
      const otherValueNumber = toMaybeNumber(otherValue)
      return Number.isFinite(valueNumber) && Number.isFinite(otherValueNumber)
        ? operators[operator](valueNumber!, otherValueNumber!)
        : true
    },
    message,
  })

export const greaterThanOrEqual = (
  message = 'Value must be greater than or equal to its reference value.',
) => createComparisonRule('>=', message)

export const greaterThan = (
  message = 'Value must be greater than its reference value.',
) => createComparisonRule('>', message)

export const lessThanOrEqual = (
  message = 'Value must be must be less than or equal its reference value.',
) => createComparisonRule('<=', message)

export const lessThan = (
  message = 'Value must be must be less than its reference value.',
) => createComparisonRule('<', message)

export const asyncConditionalRule = (
  condition: Ref<boolean>,
  rule: RegleRuleDefinition<string, string, [], true>,
) =>
  createRule({
    validator: async (value: Maybe<string>) => {
      return condition.value ? await rule.validator(value) : true
    },
    message: rule.message,
  })
