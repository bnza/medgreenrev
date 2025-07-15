import type {
  ApiRequestOptions,
  DeleteItemPath,
  DeleteItemResponseMap,
  OperationPathParams,
} from '~~/types'
import { BaseOperation } from './BaseOperation'

export class DeleteItemOperation<
  P extends DeleteItemPath,
> extends BaseOperation<P> {
  request(
    pathParams: OperationPathParams<P, 'delete'>,
    options?: ApiRequestOptions,
  ) {
    return this._request<DeleteItemResponseMap[DeleteItemPath]>(
      this.expandUrlTemplate('delete', pathParams),
      { ...options, method: 'delete' },
    )
  }
}
