import {BaseRequest} from "./BaseRequest";
import type {
  ApiPath,
  ApiRequestOptions, DeleteItemPath, DeleteItemResponseMap,
  GetCollectionPath,
  GetCollectionResponseMap,
  GetItemPath, GetItemResponseMap, OperationPathParams, PatchItemPath, PostCollectionPath, PostCollectionResponseMap,
} from "~~/types";

export type DynamicRepositoryConfig = {
  collectionPath?: string
  itemPath?: string
  postPath?: string
  deletePath?: string
  patchPath?: string
}

export abstract class BaseApiRepository<
  CollectionPath extends GetCollectionPath,
  ItemPath extends GetItemPath,
  PostPath extends PostCollectionPath | never = never,
  DeletePath extends DeleteItemPath | never = never,
  PatchPath extends PatchItemPath | never = never
> extends BaseRequest {
  public readonly resourcePath: string
  protected readonly collectionPath: string
  protected readonly itemPath: string
  protected readonly postPath?: string
  protected readonly deletePath?: string
  protected readonly patchPath?: string

  constructor(
    defaultPaths: {
      collectionPath: CollectionPath
      itemPath?: ItemPath
      postPath?: PostPath
      deletePath?: DeletePath
      patchPath?: PatchPath
    },
    runtimeConfig?: DynamicRepositoryConfig
  ) {
    super();


    this.collectionPath = runtimeConfig?.collectionPath || defaultPaths.collectionPath;
    this.resourcePath = this.collectionPath;
    this.itemPath = runtimeConfig?.itemPath || defaultPaths.itemPath || `${this.collectionPath}/{id}`;
    this.postPath = runtimeConfig?.postPath || defaultPaths.postPath;
    this.deletePath = runtimeConfig?.deletePath || defaultPaths.deletePath;
    this.patchPath = runtimeConfig?.patchPath || defaultPaths.patchPath;
  }

  protected getItemPath<P extends ApiPath, M extends 'get' | 'patch' | 'delete'>(
    path: P,
    method: M,
    pathParams: OperationPathParams<P, M>
  ) {
    let finalPath = path as string;
    if (pathParams && typeof pathParams === 'object') {
      Object.entries(pathParams).forEach(([key, value]) => {
        finalPath = finalPath.replace(`{${key}}`, String(value));
      });
    }
    return finalPath
  }

  getCollection(options?: ApiRequestOptions) {
    return this._request<GetCollectionResponseMap[CollectionPath]>(this.collectionPath, {...options, method: 'get'})
  }

  getItem(pathParams: OperationPathParams<ItemPath, 'get'>, options?: ApiRequestOptions) {
    return this._request<GetItemResponseMap[ItemPath]>(
      this.getItemPath(this.itemPath as ItemPath, 'get', pathParams),
      {...options, method: 'get'})
  }

  create(options?: ApiRequestOptions) {
    return this.postPath
      ? this._request<PostCollectionResponseMap[PostPath]>(this.postPath, {...options, method: 'post'})
      : Promise.reject('Post is not implemented in this repository')
  }

  delete(pathParams: OperationPathParams<DeletePath, 'delete'>, options?: ApiRequestOptions) {
    return this.deletePath
      ? this._request<DeleteItemResponseMap[DeletePath]>(
        this.getItemPath(this.deletePath as DeletePath, 'delete', pathParams),
        {...options, method: 'delete'})
      : Promise.reject('Delete is not implemented in this repository')
  }

  patch(pathParams: OperationPathParams<PatchPath, 'patch'>, options?: ApiRequestOptions) {
    return this.patchPath
      ? this._request<DeleteItemResponseMap[PatchPath]>(
        this.getItemPath(this.patchPath as PatchPath, 'patch', pathParams),
        {...options, method: 'patch'})
      : Promise.reject('Patch is not implemented in this repository')
  }
}
