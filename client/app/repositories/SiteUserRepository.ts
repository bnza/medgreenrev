import type {GetCollectionPath, GetItemPath} from "~~/types";
import {BaseApiRepository} from "./BaseApiRepository";


export class SiteUserRepository<
  TCollectionPath extends GetCollectionPath = '/api/sites',
  TItemPath extends GetItemPath = '/api/sites/{id}'
> extends BaseApiRepository<TCollectionPath, TItemPath> {
  protected getDefaultCollectionPath(): TCollectionPath {
    return '/api/site_user_privileges' as TCollectionPath;
  }

  protected getDefaultItemPath(): TItemPath {
    return '/api/site_user_privileges/{id}' as TItemPath;
  }
}
