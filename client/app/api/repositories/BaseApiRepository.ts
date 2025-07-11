import type {
  ApiRequestOptions,
  GetCollectionPath,
  GetItemPath,
  OperationPathParams,
  PostCollectionPath
} from "~~/types";
import {GetCollectionRequest} from "~/api/requests/GetCollectionRequest";
import {BaseRequest} from "~/api/requests//BaseRequest";
import {GetItemRequest} from "~/api/requests//GetItemRequest";
import {PostCollectionRequest} from "~/api/requests//PostCollectionRequest";

export type ConstructorParameters<
  TCollectionPath extends GetCollectionPath,
  TItemPath extends GetItemPath,
  TPostPath extends PostCollectionPath
> = {
  collectionPath?: TCollectionPath
  itemPath?: TItemPath
  postPath?: TPostPath
}

export abstract class BaseApiRepository<
  TCollectionPath extends GetCollectionPath,
  TItemPath extends GetItemPath,
  TPostPath extends PostCollectionPath
> extends BaseRequest {
  public readonly resourcePath: TCollectionPath
  private readonly collectionRequest?: GetCollectionRequest<TCollectionPath>
  private readonly itemRequest?: GetItemRequest<TItemPath>
  private readonly postRequest?: PostCollectionRequest<TPostPath>

  // Abstract methods that subclasses can override to provide defaults
  protected abstract getDefaultCollectionPath(): TCollectionPath
  protected abstract getDefaultItemPath(): TItemPath
  protected abstract getDefaultPostPath(): TPostPath | undefined

  constructor(
    params: ConstructorParameters<TCollectionPath, TItemPath, TPostPath> = {}
  ) {
    super();

    const collectionPath = params.collectionPath ?? this.getDefaultCollectionPath();
    const itemPath = params.itemPath ?? this.getDefaultItemPath();
    const postPath = params.postPath ?? this.getDefaultPostPath();

    this.resourcePath = collectionPath;
    this.collectionRequest = collectionPath && new GetCollectionRequest(collectionPath);
    this.itemRequest = itemPath && new GetItemRequest(itemPath);
    this.postRequest = postPath && new PostCollectionRequest(postPath)
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

  post(options: ApiRequestOptions) {
    return this.postRequest
      ? this.postRequest.call(options)
      : Promise.reject('Post is not implemented in this repository')
  }
}
