import {BaseRequest} from './BaseRequest'
import type {ApiRequestOptions, GetCollectionResponseMap} from "~~/types";

export class GetCollectionRequest<
  TPath extends keyof GetCollectionResponseMap
> extends BaseRequest {
  constructor(
    public readonly path: TPath,
  ) {
    super();
  }
  call(options?: ApiRequestOptions) {
    return this._request<GetCollectionResponseMap[TPath]>(this.path, options)
  }
}
