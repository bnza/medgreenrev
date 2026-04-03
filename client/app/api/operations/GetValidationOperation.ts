import { GetItemOperation } from '~/api/operations/GetItemOperation'
import type { OperationPathParams, GetValidationPath } from '~~/types'

export class GetValidationOperation<
  P extends GetValidationPath,
> extends GetItemOperation<P> {
  async isValid(queryParams: Record<string, string | number>) {
    // Use empty path params since we're using query params now
    return this.request({} as OperationPathParams<P, 'get'>, {
      query: queryParams,
    }).then((res) => {
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
