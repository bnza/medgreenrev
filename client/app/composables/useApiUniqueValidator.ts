import { createRule, type Maybe } from '@regle/core'
import { isFilled } from '@regle/rules'
import type { GetValidationPath, OperationPathParams } from '~~/types'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import { extractIdFromIri, isValidIri } from '~/utils'

/**
 * Provides a reusable API validation rule using a given endpoint path, order of arguments, and a custom error message.
 * It validates data by communicating with the API and ensures tuple uniqueness.
 * Due to the regle rules architecture the first parameter is always the model property, the second parameter
 * maps the actual validator values to the ```pathParams``` object used by the {@link GetValidationOperation} ```isValid``` method.
 *
 * Ensure to match the second parameter with the actual parameter order.
 *
 * e.g.
 * ```typescript
 * // return a regle rule
 * const uniqueUser = useApiUniqueValidator(
 *   '/api/validator/unique/site_user_privileges/{site}/{user}',
 *   ['user', 'site'], //<-- order of the array matters
 *   'Duplicate [site, user] combination',
 * )
 * ```
 */
function useApiUniqueValidator<P extends GetValidationPath>(
  path: P,
  argsOrder: Array<keyof OperationPathParams<P, 'get'>>,
  message: string,
) {
  const apiValidator = new GetValidationOperation(path)

  // Spread the parameters
  return (...dependencies: Array<() => Maybe<string>>) =>
    createRule({
      async validator(value: Maybe<string>) {
        const args = [value, ...dependencies.map((dep) => dep())]
        const argsMap = {} as Record<
          keyof OperationPathParams<P, 'get'>,
          string
        >

        if (args.length === 0) return true

        // All the request values requested for validation are filled
        const formIsFilled = ref(true)
        argsOrder.forEach((argName, index) => {
          const value = args[index]
          if (!isFilled(value)) {
            formIsFilled.value = false
            return
          }
          // if a IRI is passed, the actual ID is extracted
          argsMap[argName] = isValidIri(value) ? extractIdFromIri(value) : value
        })

        //@TODO actual runtime check
        return formIsFilled.value
          ? await apiValidator.isValid({ ...argsMap } as OperationPathParams<
              P,
              'get'
            >)
          : true
      },
      message,
    })
}

export default useApiUniqueValidator
