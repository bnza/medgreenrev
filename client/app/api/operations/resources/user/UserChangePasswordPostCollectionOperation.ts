import type { ApiRequestOptions } from '~~/types'
import { PostCollectionOperation } from '~/api/operations/PostCollectionOperation'

export class UserChangePasswordPostCollectionOperation extends PostCollectionOperation<'/api/users/me/change_password'> {
  constructor() {
    super('/api/users/me/change_password')
  }

  override request(options?: ApiRequestOptions) {
    return super.request(undefined, options)
  }
}
