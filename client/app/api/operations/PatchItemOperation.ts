import type {
  ApiRequestOptions,
  OperationPathParams,
  PatchItemPath,
  PatchItemResponseMap,
} from '~~/types'
import { BaseOperation } from './BaseOperation'

export class PatchItemOperation<P extends PatchItemPath> extends BaseOperation {
  constructor(public readonly path: P) {
    super()
  }
  request(
    pathParams: OperationPathParams<P, 'patch'>,
    options?: ApiRequestOptions,
  ) {
    return this._request<PatchItemResponseMap[PatchItemPath]>(
      this.getItemPath(this.path, 'patch', pathParams),
      { ...options, method: 'patch' },
    )
  }
}
