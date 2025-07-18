import { GetItemOperation } from '~/api/operations/GetItemOperation'
import type { OperationPathParams, GetValidationPath } from '~~/types'

export class GetValidationOperation<
  P extends GetValidationPath,
> extends GetItemOperation<P> {
  async isValid(pathParams: OperationPathParams<P, 'get'>) {
    return this.request(pathParams).then((res) => {
      const isValidResponse = (value: unknown): value is { valid: number } =>
        isPlainObject(value) && 'valid' in value
      if (isValidResponse(res)) {
        return Boolean(res.valid)
      }
      console.error('Invalid response', res)
      return false
    })
  }
}
