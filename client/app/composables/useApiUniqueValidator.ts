import { createRule, type Maybe } from '@regle/core'
import { isFilled } from '@regle/rules'
import type { GetValidationPath } from '~~/types'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { extractIdFromIri, isValidIri } from '~/utils'

/**
 * Provides a reusable API validation rule using a given endpoint path with query parameters.
 * It validates data by communicating with the API and ensures tuple uniqueness.
 * Due to the regle rules architecture the first parameter is always the model property,
 * the remaining parameters map to query parameter names used by the {@link GetValidationOperation} ```isValid``` method.
 *
 * The query parameter names should match the actual parameter names expected by the validation endpoint.
 *
 * e.g.
 * ```typescript
 * // return a regle rule
 * const uniqueUser = useApiUniqueValidator(
 *   '/api/validator/unique/site_user_privileges',
 *   ['user', 'site'], // query parameter names
 *   'Duplicate [site, user] combination',
 * )
 *
 * // This will make a request to: /api/validator/unique/site_user_privileges?user=123&site=456
 * ```
 */
function useApiUniqueValidator<P extends GetValidationPath>(
  path: P,
  queryParamNames: string[],
  message: string,
) {
  const apiValidator = new GetValidationOperation(path)

  const stringify = (
    dependency: (() => Maybe<string | number>) | Maybe<string | number>,
  ) => {
    const value = typeof dependency === 'function' ? dependency() : dependency
    // null/undefined is preserved as undefined
    return typeof value === 'undefined' || value === null
      ? undefined
      : String(value)
  }

  return createRule({
    async validator(
      value: Maybe<string | number>,
      ...dependencies: Array<() => Maybe<string | number>>
    ) {
      const args = [stringify(value), ...dependencies.map(stringify)]
      const queryParams: Record<string, string> = {}

      if (args.length === 0) return true

      // All the request values requested for validation are filled
      const formIsFilled = ref(true)
      queryParamNames.forEach((paramName, index) => {
        const argValue = args[index]
        if (!isFilled(argValue)) {
          formIsFilled.value = false
          return
        }
        // if a IRI is passed, the actual ID is extracted
        queryParams[paramName] = isValidIri(argValue)
          ? extractIdFromIri(argValue)
          : argValue
      })

      return formIsFilled.value ? await apiValidator.isValid(queryParams) : true
    },
    message,
    async: true,
  })
}

export default useApiUniqueValidator
