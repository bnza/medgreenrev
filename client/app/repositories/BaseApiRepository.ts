import type {
  ApiRequestOptions,
  GetCollectionPath,
  GetItemPath,
  OperationPathParams
} from "~~/types";
import {GetCollectionRequest} from "./GetCollectionRequest";
import {BaseRequest} from "~/repositories/BaseRequest";
import {GetItemRequest} from "~/repositories/GetItemRequest";

export type ConstructorParameters<
  TCollectionPath extends GetCollectionPath,
  TItemPath extends GetItemPath
> = {
  collectionPath?: TCollectionPath
  itemPath?: TItemPath
}

export abstract class BaseApiRepository<
  TCollectionPath extends GetCollectionPath,
  TItemPath extends GetItemPath
> extends BaseRequest {
  public readonly resourcePath: TCollectionPath
  private readonly collectionRequest?: GetCollectionRequest<TCollectionPath>
  private readonly itemRequest?: GetItemRequest<TItemPath>

  // Abstract methods that subclasses can override to provide defaults
  protected abstract getDefaultCollectionPath(): TCollectionPath
  protected abstract getDefaultItemPath(): TItemPath

  constructor(
    params: ConstructorParameters<TCollectionPath, TItemPath> = {}
  ) {
    super();

    const collectionPath = params.collectionPath ?? this.getDefaultCollectionPath();
    const itemPath = params.itemPath ?? this.getDefaultItemPath();

    this.resourcePath = collectionPath;
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
