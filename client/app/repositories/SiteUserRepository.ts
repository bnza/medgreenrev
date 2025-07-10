import type {GetCollectionPath, GetItemPath, PostCollectionPath} from "~~/types";
import {BaseApiRepository} from "./BaseApiRepository";


export class SiteUserRepository<
  TCollectionPath extends GetCollectionPath = '/api/site_user_privileges',
  TItemPath extends GetItemPath = '/api/site_user_privileges/{id}',
  TPostPath extends PostCollectionPath = '/api/site_user_privileges'
> extends BaseApiRepository<TCollectionPath, TItemPath, TPostPath> {
  protected getDefaultCollectionPath() {
    return '/api/site_user_privileges' as TCollectionPath;
  }

  protected getDefaultItemPath() {
    return '/api/site_user_privileges/{id}' as TItemPath;
  }

  protected getDefaultPostPath() {
    return undefined;
  }
}
