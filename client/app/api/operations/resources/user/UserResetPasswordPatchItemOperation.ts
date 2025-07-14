import type { ApiRequestOptions, OperationPathParams } from '~~/types'
import { PatchItemOperation } from '~/api/operations/PatchItemOperation'

export class UserResetPasswordPatchItemOperation extends PatchItemOperation<'/api/users/{id}'> {
  constructor() {
    super('/api/users/{id}')
  }

  override request(
    pathParams: OperationPathParams<'/api/users/{id}', 'patch'>,
    options?: ApiRequestOptions,
  ) {
    return super.request(pathParams, options)
  }
}
