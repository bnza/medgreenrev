import { BaseOperation } from '~/api/operations/BaseOperation'
import type {
  ApiRequestOptions,
  PostCollectionPath,
  PostCollectionResponseMap,
} from '~~/types'

export class PostCollectionOperation<
  P extends PostCollectionPath,
> extends BaseOperation {
  constructor(public readonly path: P) {
    super()
  }

  request(options?: ApiRequestOptions) {
    return this._request<PostCollectionResponseMap[P]>(this.path, {
      ...options,
      method: 'post',
    })
  }
}
