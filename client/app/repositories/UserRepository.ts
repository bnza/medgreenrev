import type {GetCollectionPath, GetItemPath, OperationDetails} from "~~/types";
import {BaseApiRepository} from "./BaseApiRepository";


export class UserRepository<
  TCollectionPath extends GetCollectionPath = '/api/users',
  TItemPath extends GetItemPath = '/api/users/{id}'
> extends BaseApiRepository<TCollectionPath, TItemPath> {
  protected getDefaultCollectionPath(): TCollectionPath {
    return '/api/users' as TCollectionPath;
  }

  protected getDefaultItemPath(): TItemPath {
    return '/api/users/{id}' as TItemPath;
  }

  getUsersMe() {
    return this._request<OperationDetails<'/api/users/me', 'get'>['responses']['200']['content']['application/ld+json']>('/api/users/me')
  }
}
