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

export const greaterThanOrEqual = (
  message = 'Value must be greater than or equal to its reference value.',
) =>
  createRule({
    validator: (
      value: Maybe<number | string>,
      otherValue: Maybe<number | string>,
    ) => {
      const valueNumber = Number(value)
      const otherValueNumber = Number(otherValue)
      return Number.isFinite(valueNumber) && Number.isFinite(otherValueNumber)
        ? valueNumber >= otherValueNumber
        : true
    },
    message,
  })

export const lessThanOrEqual = (
  message = 'Value must be must be less than or equal its reference value.',
) =>
  createRule({
    validator: (
      value: Maybe<number | string>,
      otherValue: Maybe<number | string>,
    ) => {
      const valueNumber = Number(value)
      const otherValueNumber = Number(otherValue)
      return Number.isFinite(valueNumber) && Number.isFinite(otherValueNumber)
        ? valueNumber <= otherValueNumber
        : true
    },
    message,
  })

export const asyncConditionalRule = (
  condition: Ref<boolean>,
  rule: RegleRuleDefinition<string, [], true, boolean>,
) =>
  createRule({
    validator: async (value: Maybe<string>) => {
      return condition.value ? await rule.validator(value) : true
    },
    message: rule.message,
  })
