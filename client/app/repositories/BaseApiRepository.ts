import type {
  ApiRequestOptions,
  GetCollectionPath,
  GetCollectionResponseMap,
  GetItemPath,
  GetItemResponseMap, OperationPathParams
} from "~~/types";
import {GetCollectionRequest} from "./GetCollectionRequest";
import {BaseRequest} from "~/repositories/BaseRequest";
import {GetItemRequest} from "~/repositories/GetItemRequest";

type ConstructorParameters<
  TCollectionPath extends GetCollectionPath,
  TItemPath extends GetItemPath
> = {
  collectionPath?: TCollectionPath
  itemPath?: TItemPath
}

export class BaseApiRepository<
  TCollectionPath extends GetCollectionPath,
  TItemPath extends GetItemPath
> extends BaseRequest {
  private readonly collectionRequest?: GetCollectionRequest<TCollectionPath>
  private readonly itemRequest?: GetItemRequest<TItemPath>
  constructor(
    {
      collectionPath,
      itemPath,
    } : ConstructorParameters<TCollectionPath, TItemPath>
  )  {
    super();
    this.collectionRequest = collectionPath && new GetCollectionRequest(collectionPath);
    this.itemRequest = itemPath && new GetItemRequest(itemPath);
  }

  getCollection(options: ApiRequestOptions) {
    return this.collectionRequest
      ? this.collectionRequest.call(options)
      : Promise.reject('Get collection is not implemented in this repository')
  }

  getItem(
    pathParams: OperationPathParams<TItemPath, 'get'>,
    options?: ApiRequestOptions
  ) {
    return this.itemRequest
      ? this.itemRequest.call(pathParams, options)
      : Promise.reject('Get item is not implemented in this repository')
  }
}
