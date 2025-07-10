import type {GetCollectionPath, GetItemPath, OperationDetails, PostCollectionPath} from "~~/types";
import {BaseApiRepository} from "./BaseApiRepository";


export class UserRepository<
  TCollectionPath extends GetCollectionPath = '/api/users',
  TItemPath extends GetItemPath = '/api/users/{id}',
  TPostPath extends PostCollectionPath = '/api/users'
> extends BaseApiRepository<TCollectionPath, TItemPath, TPostPath> {
  protected getDefaultCollectionPath() {
    return '/api/users' as TCollectionPath;
  }

  protected getDefaultItemPath(){
    return '/api/users/{id}' as TItemPath;
  }

  protected getDefaultPostPath() {
    return undefined;
  }

  getUsersMe() {
    return this._request<OperationDetails<'/api/users/me', 'get'>['responses']['200']['content']['application/ld+json']>('/api/users/me')
  }
}
