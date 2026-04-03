import type { ApiRequestOptions, OperationPathParams } from '~~/types'
import { PatchItemOperation } from '~/api/operations/PatchItemOperation'

export class UserResetPasswordPatchItemOperation extends PatchItemOperation<'/api/admin/users/{id}/change_password'> {
  constructor() {
    super('/api/admin/users/{id}/change_password')
  }

  override request(
    pathParams: OperationPathParams<
      '/api/admin/users/{id}/change_password',
      'patch'
    >,
    options?: ApiRequestOptions,
  ) {
    return super.request(pathParams, options)
  }
}
