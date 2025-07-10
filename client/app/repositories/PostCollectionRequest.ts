import {BaseRequest} from './BaseRequest'
import type {ApiRequestOptions, PostCollectionResponseMap} from "~~/types";

export class PostCollectionRequest<
  TPath extends keyof PostCollectionResponseMap
> extends BaseRequest {
  constructor(
    public readonly path: TPath,
  ) {
    super();
  }
  call(options?: ApiRequestOptions) {
    return this._request<PostCollectionResponseMap[TPath]>(this.path, {...options, method: 'post'})
  }
}
