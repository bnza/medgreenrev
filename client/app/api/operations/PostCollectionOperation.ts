import { BaseOperation } from '~/api/operations/BaseOperation'
import type {
  ApiRequestOptions,
  OperationPathParams,
  PostCollectionPath,
  PostCollectionResponseMap,
} from '~~/types'

export class PostCollectionOperation<
  P extends PostCollectionPath,
> extends BaseOperation<P> {
  request(
    pathParams?: OperationPathParams<P, 'post'>,
    options?: ApiRequestOptions,
  ) {
    return this._request<PostCollectionResponseMap[P]>(
      pathParams ? this.expandUrlTemplate('post', pathParams) : this.path,
      {
        ...options,
        method: 'post',
      },
    )
  }
}
