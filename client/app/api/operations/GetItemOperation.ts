import type {ApiRequestOptions, GetItemPath, GetItemResponseMap, OperationPathParams} from "~~/types";
import {BaseOperation} from "./BaseOperation";

export class GetItemOperation<P extends GetItemPath> extends BaseOperation{
  constructor(
    public readonly path: P,
  ) {
    super();
  }
  request(pathParams: OperationPathParams<P, 'get'>, options?: ApiRequestOptions) {
    return this._request<GetItemResponseMap[GetItemPath]>(
      this.getItemPath(this.path, 'get', pathParams),
      {...options, method: 'get'})
  }
}
