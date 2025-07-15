import { BaseOperation } from '~/api/operations/BaseOperation'
import type {
  ApiRequestOptions,
  GetCollectionPath,
  GetCollectionResponseMap,
  OperationPathParams,
} from '~~/types'

export class GetCollectionOperation<
  P extends GetCollectionPath,
> extends BaseOperation<P> {
  request(options?: ApiRequestOptions) {
    const pathParams = ref<OperationPathParams<P, 'get'>>()
    if (options?.params) {
      pathParams.value = options.params as OperationPathParams<P, 'get'>
    }
    return this._request<GetCollectionResponseMap[P]>(
      pathParams.value
        ? this.expandUrlTemplate('get', pathParams.value)
        : this.path,
      {
        ...options,
        method: 'get',
      },
    )
  }
}
