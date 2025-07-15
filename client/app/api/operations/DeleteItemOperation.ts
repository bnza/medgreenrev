import type {
  ApiRequestOptions,
  DeleteItemPath,
  DeleteItemResponseMap,
  OperationPathParams,
} from '~~/types'
import { BaseOperation } from './BaseOperation'

export class DeleteItemOperation<
  P extends DeleteItemPath,
> extends BaseOperation {
  constructor(public readonly path: P) {
    super()
  }

  request(
    pathParams: OperationPathParams<P, 'delete'>,
    options?: ApiRequestOptions,
  ) {
    return this._request<DeleteItemResponseMap[DeleteItemPath]>(
      this.expandUrlTemplate(this.path, 'delete', pathParams),
      { ...options, method: 'delete' },
    )
  }
}
