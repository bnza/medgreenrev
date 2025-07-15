import { BaseOperation } from '~/api/operations/BaseOperation'
import type {
  ApiRequestOptions,
  OperationPathParams,
  PostCollectionPath,
  PostCollectionResponseMap,
} from '~~/types'

export class PostCollectionOperation<
  P extends PostCollectionPath,
> extends BaseOperation {
  constructor(public readonly path: P) {
    super()
  }

  request(
    pathParams?: OperationPathParams<P, 'post'>,
    options?: ApiRequestOptions,
  ) {
    return this._request<PostCollectionResponseMap[P]>(
      pathParams
        ? this.expandUrlTemplate(this.path, 'patch', pathParams)
        : this.path,
      {
        ...options,
        method: 'post',
      },
    )
  }
}
