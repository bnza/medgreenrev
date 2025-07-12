import {BaseOperation} from "~/api/operations/BaseOperation";
import type {ApiRequestOptions, GetCollectionPath, GetCollectionResponseMap} from "~~/types";

export class GetCollectionOperation<P extends GetCollectionPath> extends BaseOperation{
  constructor(
    public readonly path: P,
  ) {
    super();
  }

  request(options?: ApiRequestOptions) {
    return this._request<GetCollectionResponseMap[P]>(this.path, {...options, method: 'get'})
  }
}
