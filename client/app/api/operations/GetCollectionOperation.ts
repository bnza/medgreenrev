import { BaseOperation } from '~/api/operations/BaseOperation'
import type {
  ApiRequestOptions,
  CollectionAcl,
  GetCollectionPath,
  GetCollectionResponseMap,
  OperationPathParams,
} from '~~/types'

export class GetCollectionOperation<
  P extends GetCollectionPath,
> extends BaseOperation<P> {
  private prepareRequest(options?: ApiRequestOptions) {
    const pathParams = ref<OperationPathParams<P, 'get'>>()
    if (options?.params) {
      pathParams.value = options.params as OperationPathParams<P, 'get'>
      delete options.params
    }

    const urlPath = pathParams.value
      ? this.expandUrlTemplate('get', pathParams.value)
      : this.path

    return { urlPath, options }
  }

  request(options?: ApiRequestOptions) {
    const { urlPath, options: preparedOptions } = this.prepareRequest(options)
    return this._request<GetCollectionResponseMap[P] & { _acl: CollectionAcl }>(
      urlPath,
      {
        ...preparedOptions,
        method: 'get',
      },
    )
  }

  async requestCsv(options?: ApiRequestOptions): Promise<string> {
    const { urlPath, options: preparedOptions } = this.prepareRequest(options)
    return await this._request<string>(urlPath, {
      ...preparedOptions,
      method: 'get',
      headers: {
        Accept: 'text/csv',
        ...preparedOptions?.headers,
      },
    })
  }
}
