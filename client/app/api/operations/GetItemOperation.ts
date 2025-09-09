import type {
  ApiRequestOptions,
  GetItemPath,
  GetItemResponseMap,
  OperationPathParams,
} from '~~/types'
import { BaseOperation } from './BaseOperation'

export class GetItemOperation<P extends GetItemPath> extends BaseOperation<P> {
  request(
    pathParams = {} as OperationPathParams<P, 'get'>,
    options?: ApiRequestOptions,
  ) {
    return this._request<GetItemResponseMap[P]>(
      this.expandUrlTemplate('get', pathParams),
      { ...options, method: 'get' },
    )
  }
}
