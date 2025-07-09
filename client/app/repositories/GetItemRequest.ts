import {BaseRequest} from './BaseRequest'
import type {ApiRequestOptions, GetItemPath, GetItemResponseMap, OperationPathParams} from "~~/types";

export class GetItemRequest<
  TPath extends GetItemPath
> extends BaseRequest {
  constructor(
    public readonly path: TPath,
  ) {
    super();
  }
  call(
    pathParams: OperationPathParams<TPath, 'get'>,
    options?: ApiRequestOptions
  ) {
    // Replace path parameters in the URL
    let finalPath = this.path as string;
    if (pathParams && typeof pathParams === 'object') {
      Object.entries(pathParams).forEach(([key, value]) => {
        finalPath = finalPath.replace(`{${key}}`, String(value));
      });
    }

    return this._request<GetItemResponseMap[TPath]>(finalPath, options)
  }
}
