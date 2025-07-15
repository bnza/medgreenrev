import type {
  ApiRequestOptions,
  OperationPathParams,
  PatchItemNoResponsePath,
  PatchItemPath,
  PatchItemResponseMap,
} from '~~/types'
import { BaseOperation } from './BaseOperation'

export class PatchItemOperation<
  P extends PatchItemPath | PatchItemNoResponsePath,
> extends BaseOperation<P> {
  request(
    pathParams: OperationPathParams<P, 'patch'>,
    options?: ApiRequestOptions,
  ) {
    return this._request<PatchItemResponseMap[PatchItemPath] | never>(
      this.expandUrlTemplate('patch', pathParams),
      { ...options, method: 'patch' },
    )
  }
}
